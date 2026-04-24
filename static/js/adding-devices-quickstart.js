// Quick-start link generator for the "Adding Devices" contributing page.
// Plain vanilla JS — no framework. Loaded via <Head> in adding-devices.mdx.
(function () {
  "use strict";

  function slugify(value) {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]+/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Accepts a bare username, or any common GitHub URL/path form, e.g.:
  //   octocat
  //   octocat/esphome-devices
  //   github.com/octocat
  //   https://github.com/octocat/esphome-devices
  //   https://github.com/octocat/esphome-devices.git
  // Returns just the username.
  function parseUsername(value) {
    var v = value.trim();
    if (!v) return "";
    v = v.replace(/^https?:\/\//i, "");
    v = v.replace(/^(www\.)?github\.com\//i, "");
    var match = v.match(/^([^\/\?#\s]+)/);
    if (!match) return "";
    return match[1].replace(/\.git$/i, "");
  }

  function buildTemplate(name) {
    var today = new Date().toISOString().slice(0, 10);
    var fence = "```";
    return [
      "---",
      "title: " + name,
      "date-published: " + today,
      "type: ",
      "standard: ",
      "board: ",
      "---",
      "",
      "# " + name,
      "",
      "<!-- Describe the device here. See the front-matter table on the contributing page for valid options. -->",
      "",
      "## Basic Configuration",
      "",
      fence + "yaml",
      "# Paste a working ESPHome YAML configuration here",
      fence,
      "",
    ].join("\n");
  }

  function update() {
    var userInput = document.getElementById("quickstart-username");
    var nameInput = document.getElementById("quickstart-device");
    var pathHint = document.getElementById("quickstart-path");
    var link = document.getElementById("quickstart-link");
    var placeholder = document.getElementById("quickstart-placeholder");
    if (!userInput || !nameInput || !link || !placeholder) {
      return;
    }

    var user = parseUsername(userInput.value);
    var name = nameInput.value.trim();
    var slug = slugify(name);

    if (user && slug) {
      if (pathHint) {
        pathHint.innerHTML =
          "File will be created at <code>src/docs/devices/" +
          slug +
          "/index.md</code>";
      }
      var params = new URLSearchParams({
        filename: slug + "/index.md",
        value: buildTemplate(name),
      });
      link.href =
        "https://github.com/" +
        encodeURIComponent(user) +
        "/esphome-devices/new/main/src/docs/devices?" +
        params.toString();
      link.style.display = "inline-block";
      placeholder.style.display = "none";
    } else {
      if (pathHint) {
        pathHint.innerHTML = "";
      }
      link.style.display = "none";
      placeholder.style.display = "inline-block";
    }
  }

  function attach() {
    var userInput = document.getElementById("quickstart-username");
    var nameInput = document.getElementById("quickstart-device");
    if (!userInput || !nameInput) {
      return;
    }
    // Avoid attaching twice if the script runs again after SPA navigation.
    if (userInput.dataset.quickstartBound === "1") {
      update();
      return;
    }
    userInput.dataset.quickstartBound = "1";
    nameInput.dataset.quickstartBound = "1";
    userInput.addEventListener("input", update);
    nameInput.addEventListener("input", update);
    update();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", attach);
  } else {
    attach();
  }
})();
