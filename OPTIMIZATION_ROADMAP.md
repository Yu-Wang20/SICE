# SICE 优化路线图 - 基于资深玩家反馈

## 优先级分类

### P0 Critical Fixes (需要立即修复)
- [ ] **EV Calculator 功能修复** - 当前点击 Calculate 无结果输出，需要调试并显示 EV 计算结果
- [ ] **Position Simulator 数值修正** - 2000% EV 等数值不合理，需要校准为真实 GTO 数据

### P1 High-Value Features (高价值功能)

#### 1.1 Quiz 模块增强
- [ ] 允许用户自定义题数和类别组合
- [ ] 添加错题本（保存错误答案和解释）
- [ ] 历史表现追踪（展示进度曲线）
- [ ] 扩充题库至 50+ 题，包括：
  - 多路底池场景（3+ 玩家）
  - ICM 泡沫阶段决策
  - 翻后复杂决策树

#### 1.2 Hand Strength Evolution 增强
- [ ] 添加"退化概率"计算（被反超的概率）
- [ ] 支持按玩家数量筛选（2-9 人）
- [ ] 支持按底池大小筛选
- [ ] 支持按公共牌纹理筛选（干燥/湿润/两极分化）

#### 1.3 GTO Strategy Library 扩展
- [ ] 扩展到 9 人桌场景
- [ ] 支持多种筹码深度（50BB、40BB、25BB）
- [ ] 3-Bet/Call/Fold 多色区分
- [ ] 支持下载为 PNG/PDF
- [ ] ICM 调整模式（赛事场景）
- [ ] Exploitative 范围生成（基于对手风格）

#### 1.4 Pot Odds 决策引擎增强
- [ ] 修复当前功能并添加可视化
- [ ] 计算隐含赔率（Implied Odds）
- [ ] 计算反向隐含赔率（Reverse Implied Odds）
- [ ] 多路底池支持
- [ ] 对手下注区间分析

#### 1.5 Push/Fold Trainer 增强
- [ ] 集成 ICM 模型
- [ ] 支持多人局面（推/弃/平跟三分策略）
- [ ] 自定义对手范围输入
- [ ] 泡沫阶段特殊处理

### P2 Advanced Features (进阶功能)

#### 2.1 Hand History Upload & Analysis
- [ ] 支持上传 HH 文件（PokerStars/GGPoker 格式）
- [ ] 自动检测关键决策点
- [ ] GTO 偏差分析
- [ ] 生成"漏勺报告"
- [ ] 改进建议输出

#### 2.2 Comparison Workbench
- [ ] 并排对比两套范围
- [ ] GTO vs Exploitative 对比
- [ ] 不同下注尺度对比
- [ ] 热力图差异展示

#### 2.3 Advanced Training Modes
- [ ] 限时挑战模式（30 秒/题）
- [ ] 连胜打卡系统
- [ ] 错题专项强化
- [ ] 排名榜（按准确率/速度）
- [ ] 成就系统（徽章解锁）

#### 2.4 Community Features
- [ ] 手牌讨论区
- [ ] 策略分享渠道
- [ ] 用户评论和反馈
- [ ] 社区热门手牌排行

### P3 Content & UX Polish (内容和 UX 优化)

#### 3.1 教学内容增强
- [ ] 每个知识板块添加"关键公式"卡片
- [ ] "策略要点"总结
- [ ] "进一步阅读"链接
- [ ] 可视化解释（Nash 均衡图、算法流程图）

#### 3.2 可视化改进
- [ ] EV 曲线图表
- [ ] 热力图展示
- [ ] 决策树交互图
- [ ] 概率分布图

## 实施计划

### Phase 1: Critical Fixes (1-2 天)
1. 调试 EV Calculator 功能
2. 修正 Position Simulator 数值
3. 测试并验证

### Phase 2: Quiz & Hand Strength (3-5 天)
1. 实现错题本和历史追踪
2. 扩充 Quiz 题库
3. Hand Strength Evolution 筛选功能

### Phase 3: GTO & Pot Odds (5-7 天)
1. GTO Strategy Library 扩展
2. Pot Odds 引擎完善
3. Push/Fold ICM 集成

### Phase 4: Advanced Features (7-10 天)
1. Hand History Upload
2. Comparison Workbench
3. Advanced Training Modes

### Phase 5: Community & Polish (5-7 天)
1. 社区功能基础设施
2. 内容和可视化优化
3. 最终测试和部署

## 预期收益

| 功能 | 当前状态 | 优化后 | 用户价值 |
|------|--------|--------|---------|
| Quiz | 22 题 | 50+ 题 + 错题本 + 追踪 | 更系统的学习路径 |
| Hand Strength | 基础统计 | 多维筛选 + 退化概率 | 更精准的决策 |
| GTO Library | 6-max 100BB | 9-max + 多深度 + Exploit | 覆盖更多场景 |
| EV Calculator | 功能缺陷 | 完整计算 + 可视化 | 可用的决策工具 |
| Hand Upload | 无 | 完整分析流程 | 实战反馈 |
| Community | 无 | 讨论 + 分享 | 社区粘性 |

## 成功指标

- [ ] 所有 P0 bugs 修复
- [ ] Quiz 错题本使用率 > 60%
- [ ] Hand History Upload 月活跃用户 > 100
- [ ] 社区帖子 > 50 条
- [ ] 用户平均会话时长 > 15 分钟
