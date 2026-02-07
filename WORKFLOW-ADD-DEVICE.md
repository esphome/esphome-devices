# Kincony ESPHome Device 添加工作流

## 准备工作

### 1. 所需材料
- 设备产品图片（高清，命名为 `<设备名>-1.jpg`，如 `B4-1.jpg`）
- ESPHome YAML 配置文件（完整的硬件定义）
- 设备资源链接（如论坛帖子链接）
- 设备基本信息：
  - 设备名称（如 KinCony-B4）
  - 设备类型（relay/sensor/switch 等）
  - 板子类型（esp32/esp8266）
  - 主要特性描述

## 工作流程

### Step 1: 创建工作分支

使用 worktree-start 创建独立的工作环境：

```bash
/worktree-start 增加 Kincony-<设备名> 设备文档
```

这会自动：
- 创建新分支（如 `feat/add-kincony-<device>`）
- 创建新的工作树
- 创建对应的 Discord 频道

### Step 2: 创建设备文档目录

在 `src/docs/devices/` 下创建设备目录：

```bash
mkdir -p src/docs/devices/KinCony-<设备名>
```

**目录结构示例**：
```
src/docs/devices/KinCony-B4/
├── B4-1.jpg          # 产品图片
└── index.md          # 设备文档
```

### Step 3: 准备 index.md 文档

**文档结构模板**：

```markdown
---
title: KinCony-<设备名> (<描述>)
date-published: YYYY-MM-DD
type: relay|sensor|switch|...
standard: global
board: esp32|esp8266
---

![Product](<设备名>-1.jpg "Product Image")

## Resources

- [ESP32 pin define details](<论坛链接>)

## ESPHome Configuration

Here is an example YAML configuration for the KinCony <设备名> <描述>.

\`\`\`yaml
esphome:
  name: <device-name>
  friendly_name: <Device Name>

# ... 完整的 ESPHome 配置 ...
\`\`\`
```

**重要注意事项**：
1. **Front matter 格式**：
   - `date-published` 使用发布日期
   - `type` 选择合适的设备类型
   - `board` 根据实际芯片填写

2. **配置内容要求**（来自 PR 模板）：
   - ✅ 不包含密码或 secrets（除了 `!secret wifi_ssid` 和 `!secret wifi_password`）
   - ✅ `wifi` 或 `ethernet` 块不包含静态 IP 地址
   - ✅ 第一个配置应该只包含**硬件定义**（基础配置）
   - 复杂示例可以在单独的配置块中提供

3. **配置检查清单**：
   - [ ] 设备名称和描述正确
   - [ ] 图片文件名匹配
   - [ ] 论坛链接正确
   - [ ] YAML 配置完整且格式正确
   - [ ] 移除所有敏感信息

### Step 4: 添加文件并提交

```bash
# 添加文件
git add src/docs/devices/KinCony-<设备名>/

# 提交（使用规范的 commit message）
git commit -m "feat: add KinCony-<设备名> device documentation

- Add <设备名>-1.jpg product image
- Add index.md with ESPHome configuration
- Follows same structure as existing KinCony devices"
```

### Step 5: 推送到远程仓库

```bash
git push -u origin feat/add-kincony-<device>
```

### Step 6: 创建 PR 到上游

使用 `gh` CLI 创建 PR：

```bash
gh pr create --repo esphome/esphome-devices \
  --title "Add KinCony-<设备名> device documentation" \
  --body "<填写 PR 模板内容>"
```

**PR 模板内容**：

```markdown
# Brief description of the changes

Add KinCony-<设备名> (<描述>) device documentation with complete ESPHome configuration example.

## Type of changes

- [x] New device
- [ ] Update existing device
- [ ] Removing a device
- [ ] General cleanup
- [ ] Other

## Checklist:

- [x] There are no passwords or secrets references in any examples. 
      The only exceptions are \`!secret wifi_ssid\` and \`!secret wifi_password\`.
- [x] The \`wifi\` or \`ethernet\` block has no static / manual ip address specified.
- [x] The first configuration provided should be **hardware definitions only**.
      A more involved example can be provided in a separate configuration block.

## Device Details

- **Device**: KinCony-<设备名>
- **Board**: ESP32-S3/ESP32/等
- **Features**: <主要特性列表>
- **Documentation**: Complete ESPHome YAML configuration with all hardware definitions
```

### Step 7: 等待审核和合并

PR 创建后：
1. Netlify 会自动构建预览版本
2. 等待 esphome-devices 维护者审核
3. 根据反馈修改（如果需要）
4. 合并后，使用 `/worktree-archive` 清理工作树

## 参考示例

### 已完成设备
- **KinCony-AIO**: `src/docs/devices/KinCony-AIO/`
- **KinCony-B4**: `src/docs/devices/KinCony-B4/` (PR #1446)

### 文件大小建议
- 图片：< 500KB（建议压缩）
- 配置：完整但简洁，只包含必要的硬件定义

## 常见问题

### Q1: 设备名称使用什么格式？
A: 使用 `KinCony-<型号>`，如 `KinCony-B4`、`KinCony-AIO`

### Q2: 如果设备有多个变体怎么办？
A: 可以在同一文档中提供多个配置示例，或创建单独的目录

### Q3: 图片格式有要求吗？
A: 推荐 JPG 格式，尺寸适中（建议 1000-2000px 宽度）

### Q4: PR 被拒绝了怎么办？
A: 
1. 查看审核意见
2. 在同一分支上修改
3. 推送更新（PR 会自动同步）
4. 等待重新审核

## 批量添加建议

对于多个设备：
1. 准备好所有设备的素材（图片、配置）
2. 为每个设备创建独立的分支和 PR
3. 使用统一的命名和格式
4. 可以并行进行，互不干扰

## 自动化改进建议

未来可以考虑：
- 创建设备添加脚本（自动生成目录结构）
- 配置文件模板生成器
- PR 自动化工具

---

**维护者**: Forge 🔨  
**最后更新**: 2026-02-05  
**基于**: KinCony-B4 添加流程总结
