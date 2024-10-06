#ifndef SB1_UART_H_
#define SB1_UART_H_

#include "esphome.h"
using namespace esphome;

#define SB1_MAX_LEN      256   // Max length of message value
#define SB1_BUFFER_LEN   6     // Length of serial buffer for header + type + length
#define SB1_HEADER_LEN   2     // Length of fixed header
#define HOOK_STALL_TIME  50    // Time to delay in shutdown hook before actually sleeping
#define RESET_ACK_DELAY  250   // Time to wait before rebooting due to reset
#define EVENT_ACK_DELAY  250   // Time to wait before acking motion event and getting put to sleep
#define ACK_WAIT_TIMEOUT 1000  // Time to wait for handshake response before re-sending request
#define HALT_SLEEP_DELAY 1000 * 1000 * 120 // Time to deepsleep when waiting to get put to sleep by the SB1
#define NORM_MAX_UPTIME  1000  // Time to ttay in RUNNING_NORMAL waiting for an event before sleeping
#define OTA_MAX_UPTIME   30000 // Time to stay in RUNNING_OTA waiting for OTA before rebooting
                               // This is a safety measure; although the SB1 will let us stay up for about 120
                               // seconds, starting an OTA too late will likely result in the ESP getting put
                               // to sleep before eboot can finish copying the new image. Since eboot clears
                               // the copy command BEFORE copying the OTA image over the permanent image,
                               // this can leave the device in an unbootable state.

static const char *TAG = "sb1";
static const uint16_t SB1_HEADER = 0x55AA;

static const uint8_t SB1_EVENT_ACK[]            = {0x00};
static const uint8_t SB1_STATUS_CONF_STA[]      = {0x00};
static const uint8_t SB1_STATUS_CONF_AP[]       = {0x01};
static const uint8_t SB1_STATUS_BOOT_WIFI[]     = {0x02};
static const uint8_t SB1_STATUS_BOOT_DHCP[]     = {0x03};
static const uint8_t SB1_STATUS_BOOT_COMPLETE[] = {0x04};

enum SB1MessageType {
  SB1_MESSAGE_TYPE_INVALID = 0,
  SB1_MESSAGE_TYPE_HANDSHAKE,
  SB1_MESSAGE_TYPE_STATUS,
  SB1_MESSAGE_TYPE_RESET,
  SB1_MESSAGE_TYPE_UNKNOWN,
  SB1_MESSAGE_TYPE_EVENT
};

enum SB1EventType {
  SB1_EVENT_TYPE_DOOR   = 0x0104,
  SB1_EVENT_TYPE_MOTION = 0x6501,
  SB1_EVENT_TYPE_DOOR_RESET   = 0x6504,
  SB1_EVENT_TYPE_MOTION_RESET = 0x6604
};

enum SB1State {
  SB1_STATE_HANDSHAKE = 0,
  SB1_STATE_HANDSHAKE_ACK,
  SB1_STATE_CONF_AP,
  SB1_STATE_CONF_AP_ACK,
  SB1_STATE_CONF_STA,
  SB1_STATE_CONF_STA_ACK,
  SB1_STATE_BOOT_WIFI,
  SB1_STATE_BOOT_WIFI_ACK,
  SB1_STATE_BOOT_DHCP,
  SB1_STATE_BOOT_DHCP_ACK,
  SB1_STATE_BOOT_COMPLETE,
  SB1_STATE_BOOT_COMPLETE_ACK,
  SB1_STATE_RESET_ACK,
  SB1_STATE_EVENT_ACK,
  SB1_STATE_RUNNING_OTA,
  SB1_STATE_RUNNING_NORMAL
};

struct SB1Message {
  uint16_t header;
  uint16_t type;
  uint16_t length;
  uint8_t value[SB1_MAX_LEN];
  uint8_t checksum;
};

class SB1UARTComponent : public Component, public uart::UARTDevice {
  protected:
    binary_sensor::BinarySensor *sensor_{nullptr};
    SB1State state_{SB1_STATE_HANDSHAKE};
    SB1Message message_{SB1_HEADER, SB1_MESSAGE_TYPE_INVALID, 0, {}, 0};
    ESPPreferenceObject rtc_;
    bool ota_mode_{false};
    uint32_t state_start_{0};
    uint8_t uart_buffer_[SB1_BUFFER_LEN]{0};
    uint8_t product_info_[SB1_MAX_LEN]{0};

    /*
     * Attempt to read an entire message from the serial UART into the message struct.
     * Will fail early if unable to find the two-byte header in the current
     * data stream. If the header is found, it will contine to read the complete
     * TLV+checksum sequence off the port. If the entire sequence can be read
     * and the checksum is valid, it will return true.
     */
    bool read_message() {
      // Shift bytes through until we find a valid header
      bool valid_header = false;
      while (available() >= 1) {
        this->uart_buffer_[0] = this->uart_buffer_[1];
        read_byte(this->uart_buffer_ + 1);
        this->message_.header = (this->uart_buffer_[0] << 8) + this->uart_buffer_[1];
        if (this->message_.header == SB1_HEADER) {
          valid_header = true;
          break;
        }
      }

      // Read the next 4 bytes (type plus length), then the indicated length, then the checksum byte
      if (valid_header) {
        read_array(this->uart_buffer_ + SB1_HEADER_LEN, SB1_BUFFER_LEN - SB1_HEADER_LEN);
        this->message_.type = (this->uart_buffer_[2] << 8) + this->uart_buffer_[3];
        this->message_.length = (this->uart_buffer_[4] << 8) + this->uart_buffer_[5];
        ESP_LOGV(TAG, "Got message type=0x%04X length=0x%04X", this->message_.type, this->message_.length);

        if (this->message_.length < SB1_MAX_LEN){
          read_array(this->message_.value, this->message_.length);
          read_byte(&this->message_.checksum);
          if (checksum() == this->message_.checksum) {
            // Clear buffer contents to start with beginning of next message
            memset(this->uart_buffer_, 0, SB1_BUFFER_LEN);
            return true;
          }
        } else {
          memset(this->uart_buffer_, 0, SB1_BUFFER_LEN);
          ESP_LOGE(TAG, "Message length exceeds limit: %d >= %d", this->message_.length, SB1_MAX_LEN);
        }
      }

      // Do not clear buffer to allow for resume in case of reading partway through header RX
      return false;
    }

    /*
     * Store the given type, value, and length into the message struct and send
     * it out the serial port. Automatically calculates the checksum as well.
     */
    void write_message(SB1MessageType type, const uint8_t *value, uint16_t length) {
      // Copy params into message struct
      this->message_.header = SB1_HEADER;
      this->message_.type = type;
      this->message_.length = length;
      ESP_LOGV(TAG, "Sending message: header=0x%04X type=0x%04X length=0x%04X",
               this->message_.header, this->message_.type, this->message_.length);
      memcpy(&this->message_.value, value, length);
      // Copy struct values into buffer, converting longs to big-endian
      this->uart_buffer_[0] = this->message_.header >> 8;
      this->uart_buffer_[1] = this->message_.header & 0xFF;
      this->uart_buffer_[2] = this->message_.type >> 8;
      this->uart_buffer_[3] = this->message_.type & 0xFF;
      this->uart_buffer_[4] = this->message_.length >> 8;
      this->uart_buffer_[5] = this->message_.length & 0xFF;
      this->message_.checksum = checksum();
      // Send buffer out via UART
      write_array(this->uart_buffer_, SB1_BUFFER_LEN);
      write_array(this->message_.value, this->message_.length);
      write_byte(this->message_.checksum);
      // Clear buffer contents to avoid re-reading our own payload
      memset(this->uart_buffer_, 0, SB1_BUFFER_LEN);
    }

    /*
     * Calculate checksum from current UART buffer (header+type+length) plus message value.
     */
    uint8_t checksum() {
      uint8_t checksum = 0;
      for (size_t i = 0; i < SB1_BUFFER_LEN; i++) {
        checksum += this->uart_buffer_[i];
      }
      for (size_t i = 0; i < this->message_.length; i++) {
        checksum += this->message_.value[i];
      }
      return checksum;
    }

    bool message_matches(SB1MessageType type, uint16_t length) {
      ESP_LOGV(TAG, "Checking type(%d == %d) && length(%d >= %d)",
               this->message_.type, type, this->message_.length, length);
      return (this->message_.type == type && this->message_.length >= length);
    }

    /* 
     * Update state machine
     */
    void set_state(SB1State state) {
      if (this->state_ != state){
        ESP_LOGD(TAG, "state: %d -> %d after %d ms", this->state_, state, state_duration());
        this->state_ = state;
        this->state_start_ = millis();
      }
    }

    /*
     * Get time since the last state change
     */
    uint32_t state_duration() {
      return (millis() - this->state_start_);
    }

    /*
     * Check to see if client connection is up - either
     * ESP as MQTT client to HA, or HA as API client to ESP.
     */
    bool client_is_connected() {
      // TODO: extend -core support to expose connected API client count
      if (mqtt::global_mqtt_client != nullptr && mqtt::global_mqtt_client->is_connected()){
        return true;
      } else {
        return false;
      }
    }

  public:
    SB1UARTComponent(uart::UARTComponent *parent, binary_sensor::BinarySensor *sensor)
        : uart::UARTDevice(parent)
        , sensor_(sensor) {}

    // Run after hardware (UART), but before WiFi and MQTT so that we can
    // send status messages to the SB1 as these components come up.
    float get_setup_priority() const override {
      return setup_priority::DATA;
    }

    // Run very late in the loop, so that other components can process
    // before we check on their state and send status to the SB1.
    float get_loop_priority() const override {
      return -50.0f;
    }

    void setup() override {
      ESP_LOGCONFIG(TAG, "Setting up SB1 UART...");
      this->rtc_ = global_preferences->make_preference<bool>(this->sensor_->get_object_id_hash());
      this->rtc_.load(&this->ota_mode_);

      if (!this->ota_mode_) {
        if (mqtt::global_mqtt_client != nullptr) {
            ESP_LOGD(TAG, "Disabling MQTT discovery outside OTA mode");
            mqtt::global_mqtt_client->disable_discovery();
        }
      }
    }

    void dump_config() override {
      ESP_LOGCONFIG(TAG, "SB1 UART:");
      ESP_LOGCONFIG(TAG, "  Boot Mode: %s", this->ota_mode_ ? "OTA" : "NORMAL");
      ESP_LOGCONFIG(TAG, "  Product Info: %s", this->product_info_);
    }

    /* 
     * State machine; generally follows the same message sequence as
     * has been observed to flow between the stock Tuya firmware and
     * the SB1 chip via the UART bus.
     */
    void loop() override {
      unsigned int event_type;
      bool have_message = read_message();

      // Reset events are user-initiated and can occur regardless of state
      if (have_message && message_matches(SB1_MESSAGE_TYPE_RESET, 0)) {
          this->ota_mode_ = true;
          set_state(SB1_STATE_RESET_ACK);
          return;
      }

      switch (this->state_) {
        case SB1_STATE_HANDSHAKE:
          write_message(SB1_MESSAGE_TYPE_HANDSHAKE, nullptr, 0);
          set_state(SB1_STATE_HANDSHAKE_ACK);
          break;
        case SB1_STATE_HANDSHAKE_ACK:
          if (have_message && message_matches(SB1_MESSAGE_TYPE_HANDSHAKE, 0)) {
            // Copy product info and add terminating null
            memcpy(this->product_info_, &this->message_.value, this->message_.length);
            memset(this->product_info_ + this->message_.length, 0, 1);
            // Go into OTA mode and wait if we've been asked to reset
            if (this->ota_mode_) {
              if (wifi::global_wifi_component->has_ap()) {
                set_state(SB1_STATE_CONF_AP);
              } else {
                set_state(SB1_STATE_CONF_STA);
              }
            } else { 
              set_state(SB1_STATE_BOOT_WIFI);
            }
          } else if (state_duration() > ACK_WAIT_TIMEOUT) {
            set_state(SB1_STATE_HANDSHAKE);
          }
          break;
        case SB1_STATE_CONF_AP:
          write_message(SB1_MESSAGE_TYPE_STATUS, SB1_STATUS_CONF_AP, 1);
          set_state(SB1_STATE_CONF_AP_ACK);
          break;
        case SB1_STATE_CONF_STA:
          write_message(SB1_MESSAGE_TYPE_STATUS, SB1_STATUS_CONF_STA, 1);
          set_state(SB1_STATE_CONF_STA_ACK);
          break;
        case SB1_STATE_BOOT_WIFI:
          if (wifi::global_wifi_component->is_connected()) {
            write_message(SB1_MESSAGE_TYPE_STATUS, SB1_STATUS_BOOT_WIFI, 1);
            set_state(SB1_STATE_BOOT_WIFI_ACK);
          }
          break;
        case SB1_STATE_BOOT_WIFI_ACK:
          if (have_message && message_matches(SB1_MESSAGE_TYPE_STATUS, 0)) {
            set_state(SB1_STATE_BOOT_DHCP);
          }
          break;
        case SB1_STATE_BOOT_DHCP:
          if (wifi::global_wifi_component->get_ip_addresses().empty() ) {
            write_message(SB1_MESSAGE_TYPE_STATUS, SB1_STATUS_BOOT_DHCP, 1);
            set_state(SB1_STATE_BOOT_DHCP_ACK);
          }
          break;
        case SB1_STATE_BOOT_DHCP_ACK:
          if (have_message && message_matches(SB1_MESSAGE_TYPE_STATUS, 0)) {
            set_state(SB1_STATE_BOOT_COMPLETE);
          }
          break;
        case SB1_STATE_BOOT_COMPLETE:
          if (client_is_connected()) {
            write_message(SB1_MESSAGE_TYPE_STATUS, SB1_STATUS_BOOT_COMPLETE, 1);
            set_state(SB1_STATE_BOOT_COMPLETE_ACK);
          }
          break;
        case SB1_STATE_BOOT_COMPLETE_ACK:
          if (have_message && message_matches(SB1_MESSAGE_TYPE_STATUS, 0)) {
            set_state(SB1_STATE_RUNNING_NORMAL);
          }
          break;
        case SB1_STATE_CONF_AP_ACK:
        case SB1_STATE_CONF_STA_ACK:
          if (have_message && message_matches(SB1_MESSAGE_TYPE_STATUS, 0)) {
            ESP_LOGI(TAG, "Waiting for OTA...");
            set_state(SB1_STATE_RUNNING_OTA);
          }
          break;
        case SB1_STATE_RESET_ACK:
          if (state_duration() > RESET_ACK_DELAY) {
            ESP_LOGI(TAG, "Rebooting: SB1_STATE_RESET_ACK");
            App.safe_reboot();
          }
          break;
        case SB1_STATE_EVENT_ACK:
          if (state_duration() > EVENT_ACK_DELAY) {
            ESP_LOGI(TAG, "Rebooting: SB1_STATE_EVENT_ACK");
            App.safe_reboot();
          }
          break;
        case SB1_STATE_RUNNING_NORMAL:
          if (have_message && message_matches(SB1_MESSAGE_TYPE_EVENT, 0)) {
            // Debug this until we figure out what these all mean
            ESP_LOGD(TAG, "Event message of length %d", this->message_.length);
            for (size_t i = 0; i < this->message_.length; i++) {
              ESP_LOGD(TAG, "%02d: 0x%02X", i, this->message_.value[i]);
            }
            // Handle various event chunks; they all seem to be 5 bytes long
            for (size_t i = 0; i < this->message_.length; i += 5) {
              event_type = (this->message_.value[i] << 8) | this->message_.value[i + 1];
              if (event_type == SB1_EVENT_TYPE_MOTION) {
                ESP_LOGI(TAG, "Motion event: %d", this->message_.value[i + 4]);
                if (this->sensor_ != nullptr) {
                  this->sensor_->publish_state(this->message_.value[i + 4] > 0);
                }
              }
              else if (event_type == SB1_EVENT_TYPE_DOOR) {
                ESP_LOGI(TAG, "Door event: %d", this->message_.value[i + 4]);
                if (this->sensor_ != nullptr) {
                  this->sensor_->publish_state(this->message_.value[i + 4] == 0);
                }
              } else if (event_type == SB1_EVENT_TYPE_MOTION_RESET ||
                         event_type == SB1_EVENT_TYPE_DOOR_RESET) {
                ESP_LOGI(TAG, "Reset event: %d", this->message_.value[i + 4]);
              }
            }
            set_state(SB1_STATE_EVENT_ACK);
          } else if (state_duration() > NORM_MAX_UPTIME) {
            ESP_LOGI(TAG, "Rebooting: SB1_STATE_RUNNING_NORMAL");
            App.safe_reboot();
          }
          break;
        case SB1_STATE_RUNNING_OTA:
          this->ota_mode_ = false;
          // Don't expect any events, just reboot if we've been up too long.
          if (state_duration() > OTA_MAX_UPTIME) {
            ESP_LOGI(TAG, "Rebooting: SB1_STATE_RUNNING_OTA");
            App.safe_reboot();
          }
          break;
      }
    }

    void on_safe_shutdown() override {
      this->rtc_.save(&this->ota_mode_);
      ESP_LOGD(TAG, "SB1 UART shutting down; next boot mode %s", this->ota_mode_ ? "OTA" : "NORMAL");
      flush();

      uint32_t start = millis();
      while (millis() - start < HOOK_STALL_TIME) {
        yield();
      }

      switch (this->state_) {
        case SB1_STATE_RESET_ACK:
          write_message(SB1_MESSAGE_TYPE_RESET, nullptr, 0);
          break;
        case SB1_STATE_EVENT_ACK:
          write_message(SB1_MESSAGE_TYPE_EVENT, SB1_EVENT_ACK, 1);
          break;
        case SB1_STATE_RUNNING_NORMAL:
          ESP.deepSleep(HALT_SLEEP_DELAY, WAKE_RF_DISABLED);
          break;
        default:
          break;
      }
    }
};

#endif // SB1_UART_H_
