---
Type: Note
tags:
  - qt
  - CPP
Status: writing
Start-date: 2025-04-24 17:07
Finish-date: 
Modified-date: 2025-05-07 22:43
Publish: false
---


好的，朋友们！上一章我们探索了 Qt 核心的信号与槽机制，那就像是给我们的应用程序装上了高效的通信系统。现在，我们要开始搭建应用程序的“脸面”了——==**图形用户界面 (GUI)**==！

Qt 提供了==**一套丰富且强大的控件库 (Widgets)**==，以及==**灵活的布局管理器 (Layouts)**==，让我们能够轻松创建出美观、交互性强的用户界面。无论你是想做个简单的工具，还是复杂的应用程序，掌握 GUI 基础都是必不可少的。

准备好了吗？让我们一起进入 Qt 的视觉世界，看看如何用代码“画”出我们想要的界面！



# **第三章：图形用户界面 (GUI) 基础**

图形用户界面（GUI）是用户与应用程序交互的窗口。Qt 通过 `QWidget` 模块提供了一整套创建 GUI 的工具。

## **3.1 常用控件 (Widgets) 详解**

控件是构成 GUI 的基本元素，比如按钮、文本框、标签等。它们都继承自 `QWidget` 类。
*   **概念:**
    控件（Widget）是用户界面的可视化组件，用户可以通过它们与应用程序进行交互或获取信息。每个控件都有自己的外观和行为。

*   **使用:**
    通常，我们在窗口或容器控件中创建并放置这些控件。==**设置父对象 (`setParent` 或在构造时传入父指针)**== 是将控件显示在窗口或容器中的关键一步。



> [!NOTE]
> 几乎所有的控件都继承自 `QWidget`。这意味着它们共享许多基本属性和方法，比如位置 (`pos`, `move`)、大小 (`size`, `resize`)、可见性 (`setVisible`, `show`, `hide`) 等。

> [!TIP]
> Qt Creator 的设计模式（Design Mode）可以让你拖拽控件来设计界面，非常直观。但理解如何在代码中创建和管理控件仍然==**非常重要**==。


> [!BUG]
> **错误:** 创建了一个控件，但在界面上看不到它。
> **后果:** 控件虽然存在于内存中，但没有被绘制出来。
> **解决:**
> 1.  确保控件有一个可见的父控件（比如一个窗口或另一个布局中的控件），并且父控件是可见的。
> 2.  确保控件自身是可见的 (`setVisible(true)` 或 `show()` 被调用，虽然对于有父控件的子控件通常会自动显示）。
> 3.  检查控件的位置和大小是否合理，是否被其他控件遮挡。
> 4.  ==**如果没有使用布局管理器，需要手动设置控件的位置 (`move()`) 和大小 (`resize()`)**==。



### **3.1.1 按钮类 (QPushButton, QToolButton, QRadioButton, QCheckBox)**

*   **概念:**
    *   `QPushButton`: 最常见的按钮，==**用于触发一个动作**==。通常显示文本或图标。
    *   `QToolButton`: 通常用于工具栏，==**常显示图标**==，外观比 `QPushButton` 更紧凑。
    *   `QRadioButton`: 单选按钮。在一组单选按钮中，==**一次只能选择一个**==。通常需要将一组 `QRadioButton` 放入一个 `QButtonGroup` 或一个容器控件（如 `QGroupBox`）中来管理互斥性。
    *   `QCheckBox`: 复选框。==**提供“开/关”或“是/否”的选择**==，可以独立选中或取消选中。

*   **使用:**

```cpp
#include <QApplication>
#include <QWidget>
#include <QPushButton>
#include <QToolButton>
#include <QRadioButton>
#include <QCheckBox>
#include <QVBoxLayout> // 使用布局管理器来自动排列
#include <QGroupBox>
#include <QDebug>

int main(int argc, char *argv[])
{
	QApplication app(argc, argv);

	QWidget window;
	window.setWindowTitle("按钮类控件示例");

	// 创建各种按钮
	QPushButton *pushButton = new QPushButton("普通按钮 (&P)"); // &P 设置快捷键 Alt+P
	QToolButton *toolButton = new QToolButton();
	toolButton->setText("工具按钮"); // 通常用图标 setIcon()
	// toolButton->setIcon(QIcon(":/path/to/icon.png"));
	toolButton->setToolTip("这是一个工具按钮提示"); // 鼠标悬停提示

	QCheckBox *checkBox = new QCheckBox("启用选项 (&E)"); // &E 设置快捷键 Alt+E
	checkBox->setChecked(true); // 默认选中

	// 单选按钮组
	QGroupBox *radioGroup = new QGroupBox("选择一个选项:");
	QRadioButton *radio1 = new QRadioButton("选项 &1"); // &1 设置快捷键 Alt+1
	QRadioButton *radio2 = new QRadioButton("选项 &2");
	radio1->setChecked(true); // 默认选中第一个
	QVBoxLayout *radioLayout = new QVBoxLayout; // 组内垂直布局
	radioLayout->addWidget(radio1);
	radioLayout->addWidget(radio2);
	radioGroup->setLayout(radioLayout);

	// 主布局
	QVBoxLayout *mainLayout = new QVBoxLayout(&window); // 在 window 上创建垂直布局
	mainLayout->addWidget(pushButton);
	mainLayout->addWidget(toolButton);
	mainLayout->addWidget(checkBox);
	mainLayout->addWidget(radioGroup);

	// ==**连接信号与槽 (简单示例)**==
	QObject::connect(pushButton, &QPushButton::clicked, [](){
		qDebug() << "普通按钮被点击了!";
	});
	QObject::connect(checkBox, &QCheckBox::toggled, [](bool checked){
		qDebug() << "复选框状态改变:" << (checked ? "选中" : "未选中");
	});
	QObject::connect(radio1, &QRadioButton::toggled, [](bool checked){
		if(checked) { // 只有选中时才处理，避免取消选中也触发消息
			qDebug() << "选项1 被选中";
		}
	});
	 QObject::connect(radio2, &QRadioButton::toggled, [](bool checked){
		if(checked) {
			qDebug() << "选项2 被选中";
		}
	});


	window.setLayout(mainLayout); // ==**将布局设置给窗口**==
	window.resize(300, 250); // 调整窗口大小以便观察
	window.show();

	return app.exec();
}
```

*   **代码解析:**
    1.  创建了 `QPushButton`, `QToolButton`, `QCheckBox`。
    2.  创建了两个 `QRadioButton`，并将它们放入一个带标题的 `QGroupBox` 中。`QGroupBox` 自然地将内部的 `QRadioButton` 分组，实现了互斥选择。我们还为 `QGroupBox` 设置了一个 `QVBoxLayout` 来排列单选按钮。
    3.  使用 `QVBoxLayout` 作为主布局管理器，将所有控件按垂直顺序添加到布局中。
    4.  将主布局 `mainLayout` 设置给 `window` (`window.setLayout(mainLayout)`)。==**这是让布局生效的关键！**==
    5.  连接了按钮的 `clicked()` 信号、复选框的 `toggled(bool)` 信号（状态改变时触发）和单选按钮的 `toggled(bool)` 信号到 Lambda 表达式，用于在控制台打印消息。注意 `toggled` 信号在选中和取消选中时都会触发。


> [!TIP]
> `QPushButton` 的文本可以使用 `&` 符号来指定快捷键 (例如 `&Save` 表示 Alt+S)。
> `QCheckBox` 和 `QRadioButton` 最常用的信号是 `toggled(bool)`，它在状态改变时发射。
> `QRadioButton` 通常需要分组使用，放在同一个父控件下（如 `QWidget` 或 `QGroupBox`）它们会自动成为一组。


> [!BUG]
> **错误:** 创建了多个 `QRadioButton`，但它们不在同一个直接父控件下，导致它们无法互斥。
> **后果:** 用户可以选择多个“单选”按钮。
> **解决:** 将需要互斥的 `QRadioButton` 放入同一个容器控件中（如 `QWidget`, `QFrame`, `QGroupBox`），或者显式地创建一个 `QButtonGroup` 并将它们添加进去。



### **3.1.2 显示类 (QLabel, QLCDNumber, QProgressBar)**

*   **概念:**
    *   `QLabel`: ==**用于显示文本或图像**==。支持富文本格式 (HTML 子集)。
    *   `QLCDNumber`: ==**模拟 LCD 数字显示屏**==，用于显示整数或浮点数。
    *   `QProgressBar`: ==**显示任务进度**==，可以是百分比或繁忙指示器。

*   **使用:**
```cpp
#include <QApplication>
#include <QWidget>
#include <QLabel>
#include <QLCDNumber>
#include <QProgressBar>
#include <QVBoxLayout>
#include <QTimer> // 用于模拟进度更新

int main(int argc, char *argv[])
{
	QApplication app(argc, argv);

	QWidget window;
	window.setWindowTitle("显示类控件示例");

	// 创建控件
	QLabel *label = new QLabel("这是一个 <font color='blue'><b>标签</b></font>."); // 支持 HTML
	label->setAlignment(Qt::AlignCenter); // 文本居中

	QLCDNumber *lcd = new QLCDNumber(5); // 设置显示位数为 5
	lcd->display(123.4); // 显示数字
	lcd->setSegmentStyle(QLCDNumber::Flat); // 设置样式

	QProgressBar *progressBar = new QProgressBar();
	progressBar->setRange(0, 100); // 设置进度范围
	progressBar->setValue(0); // 设置当前值
	// progressBar->setFormat("当前进度: %p%"); // 设置显示格式, %p 代表百分比

	// 布局
	QVBoxLayout *layout = new QVBoxLayout(&window);
	layout->addWidget(label);
	layout->addWidget(lcd);
	layout->addWidget(progressBar);

	// ==**模拟进度更新**==
	QTimer *timer = new QTimer(&window);
	QObject::connect(timer, &QTimer::timeout, [&](){
		int currentValue = progressBar->value();
		if (currentValue < progressBar->maximum()) {
			progressBar->setValue(currentValue + 1);
			lcd->display(currentValue + 1); // LCD 也同步更新
		} else {
			timer->stop(); // 停止计时器
			label->setText("==**任务完成!**==");
		}
	});
	timer->start(100); // 每 100 毫秒触发一次 timeout 信号

	window.setLayout(layout);
	window.resize(300, 150);
	window.show();

	return app.exec();
}
```

*   **代码解析:**
    1.  创建了 `QLabel`、`QLCDNumber` 和 `QProgressBar`。`QLabel` 使用了简单的 HTML 来设置文本样式。
    2.  设置了 `QLCDNumber` 的位数和样式，并显示了一个初始值。
    3.  设置了 `QProgressBar` 的范围和初始值。
    4.  使用 `QVBoxLayout` 排列控件。
    5.  创建了一个 `QTimer`，每 100 毫秒触发一次 `timeout` 信号。
    6.  连接 `timeout` 信号到一个 Lambda 表达式，该表达式负责增加进度条的值，并更新 LCD 显示，直到进度条达到最大值。达到最大值后，计时器停止，并更新标签文本。



> [!TIP]
> `QLabel` 非常灵活，可以用 `setPixmap()` 显示 `QPixmap` 图像，用 `setMovie()` 显示 `QMovie` 动画。
> `QProgressBar` 可以通过设置 `minimum` 和 `maximum` 都为 0 来显示一个==**不确定进度（繁忙指示器）**==。



> [!BUG]
> **错误:** 长时间运行的任务阻塞了 GUI 线程，导致 `QProgressBar` 不更新或界面卡死。
> **后果:** 用户体验极差，程序看起来像死掉了。
> **解决:** 将耗时任务放到==**单独的工作线程**==中执行，并通过信号与槽机制（使用 `Qt::QueuedConnection` 或 `Qt::AutoConnection` 跨线程）将进度更新信号发送回 GUI 线程来更新 `QProgressBar`。



### **3.1.3 输入类 (QLineEdit, QTextEdit, QSpinBox, QDoubleSpinBox, QComboBox)**

*   **概念:**
    *   `QLineEdit`: ==**单行文本输入框**==。可以设置输入掩码（`setInputMask`）、验证器（`setValidator`）、密码模式（`setEchoMode`）等。
    *   `QTextEdit`: ==**多行富文本编辑器**==。可以显示和编辑带格式的文本、图片、列表等。
    *   `QSpinBox`: ==**用于输入整数**==，带上下箭头调节。可以设置范围（`setRange`）、步长（`setSingleStep`）。
    *   `QDoubleSpinBox`: 类似于 `QSpinBox`，但==**用于输入浮点数**==。可以设置小数位数（`setDecimals`）。
    *   `QComboBox`: ==**下拉列表框**==。允许用户从预设列表中选择一项，也可以设置为可编辑，允许用户输入不在列表中的值。

*   **使用:**
```cpp
#include <QApplication>
#include <QWidget>
#include <QLineEdit>
#include <QTextEdit>
#include <QSpinBox>
#include <QDoubleSpinBox>
#include <QComboBox>
#include <QVBoxLayout>
#include <QFormLayout> // 使用表单布局更美观
#include <QDebug>

int main(int argc, char *argv[])
{
	QApplication app(argc, argv);

	QWidget window;
	window.setWindowTitle("输入类控件示例");

	// 创建控件
	QLineEdit *lineEdit = new QLineEdit();
	lineEdit->setPlaceholderText("请输入用户名..."); // 设置提示文本
	// lineEdit->setEchoMode(QLineEdit::Password); // 设置为密码模式

	QTextEdit *textEdit = new QTextEdit();
	textEdit->setPlainText("这是多行文本编辑器。\n可以输入很多内容。");

	QSpinBox *spinBox = new QSpinBox();
	spinBox->setRange(0, 100); // 范围 0-100
	spinBox->setValue(25);    // 初始值 25
	spinBox->setPrefix("数量: "); // 前缀
	spinBox->setSuffix(" 件");   // 后缀

	QDoubleSpinBox *doubleSpinBox = new QDoubleSpinBox();
	doubleSpinBox->setRange(0.0, 99.99);
	doubleSpinBox->setDecimals(2); // 2 位小数
	doubleSpinBox->setSingleStep(0.5); // 步长 0.5
	doubleSpinBox->setValue(10.50);
	doubleSpinBox->setPrefix("价格: ￥");

	QComboBox *comboBox = new QComboBox();
	comboBox->addItem("选项 1");
	comboBox->addItems({"选项 2", "选项 3", "选项 4"}); // 添加多个项
	// comboBox->setEditable(true); // 设置为可编辑

	// 使用表单布局 (QFormLayout) 来组织标签和输入控件
	QFormLayout *formLayout = new QFormLayout();
	formLayout->addRow("用户名:", lineEdit);
	formLayout->addRow("描述:", textEdit); // QTextEdit 比较大，可能不太适合 FormLayout，这里仅作演示
	formLayout->addRow("数量:", spinBox);
	formLayout->addRow("价格:", doubleSpinBox);
	formLayout->addRow("选择:", comboBox);

	// 主布局
	QVBoxLayout *mainLayout = new QVBoxLayout(&window);
	mainLayout->addLayout(formLayout); // 将表单布局添加到主布局

	// ==**连接信号与槽 (获取输入)**==
	QObject::connect(lineEdit, &QLineEdit::textChanged, [](const QString &text){
		qDebug() << "QLineEdit 内容改变:" << text;
	});
	QObject::connect(spinBox, QOverload<int>::of(&QSpinBox::valueChanged), [](int value){
		 qDebug() << "QSpinBox 值改变:" << value;
	});
	 QObject::connect(comboBox, &QComboBox::currentTextChanged, [](const QString &text){
		 qDebug() << "QComboBox 当前文本改变:" << text;
	 });


	window.setLayout(mainLayout);
	window.resize(400, 300);
	window.show();

	return app.exec();
}
```

*   **代码解析:**
    1.  创建了 `QLineEdit`, `QTextEdit`, `QSpinBox`, `QDoubleSpinBox`, `QComboBox`。
    2.  对每个控件进行了一些常用设置，如提示文本、范围、初始值、前后缀、添加选项等。
    3.  使用了 `QFormLayout` 来组织这些输入控件，它会自动创建标签并对齐输入框，非常适合用于设置或表单类界面。
    4.  将 `QFormLayout` 添加到主 `QVBoxLayout` 中。
    5.  连接了 `QLineEdit` 的 `textChanged(const QString &)` 信号（文本改变时触发）、`QSpinBox` 的 `valueChanged(int)` 信号（值改变时触发，注意使用 `QOverload` 处理重载）和 `QComboBox` 的 `currentTextChanged(const QString &)` 信号（当前选中项文本改变时触发）。



> [!TIP]
> `QLineEdit` 常用信号是 `textChanged(const QString &)` (实时改变) 和 `returnPressed()` (按回车)。
> 
> `QTextEdit` 常用信号是 `textChanged()`。获取内容用 `toPlainText()` (纯文本) 或 `toHtml()` (HTML)。
> 
> `QSpinBox` / `QDoubleSpinBox` 常用信号是 `valueChanged(...)`。
> 
> `QComboBox` 常用信号是 `currentIndexChanged(int)` (索引改变) 或`currentTextChanged(const QString &)` (文本改变)。



> [!BUG]
> **错误:** 试图从 `QSpinBox` 获取文本 (`text()`) 然后手动转成数字，或者从 `QLineEdit` 获取文本后未做校验就直接用于计算。
> **后果:** 可能因为转换失败导致程序崩溃或逻辑错误。
> **解决:** 使用控件提供的专用方法获取值，例如 `QSpinBox::value()` 直接返回 `int`，`QDoubleSpinBox::value()` 直接返回 `double`。对 `QLineEdit` 的内容，如果期望是数字，应使用 `toInt()`, `toDouble()` 等方法并检查转换是否成功。可以配合 `QValidator` 来限制输入。



### **3.1.4 容器类 (QGroupBox, QFrame, QTabWidget, QStackedWidget)**

*   **概念:**
    *   `QGroupBox`: ==**带边框和标题的容器**==，用于将相关的控件组织在一起。
    *   `QFrame`: ==**带边框的通用容器**==，可以设置不同的边框样式（Shape 和 Shadow）。常作为其他控件的基类或简单的分隔/组织工具。
    *   `QTabWidget`: ==**提供多页面切换（标签页）的容器**==。用户通过点击标签来切换显示不同的页面。
    *   `QStackedWidget`: ==**提供多页面层叠（卡片式）的容器**==。同一时间==**只显示一个页面**==，需要通过代码（例如连接按钮信号到 `setCurrentIndex()` 或 `setCurrentWidget()` 槽）来切换页面。

*   **使用:**

```cpp
#include <QApplication>
#include <QWidget>
#include <QTabWidget>
#include <QStackedWidget>
#include <QPushButton>
#include <QLabel>
#include <QGroupBox>
#include <QFrame>
#include <QVBoxLayout>
#include <QHBoxLayout>

int main(int argc, char *argv[])
{
	QApplication app(argc, argv);

	QWidget window;
	window.setWindowTitle("容器类控件示例");

	// --- QTabWidget 示例 ---
	QTabWidget *tabWidget = new QTabWidget();
	// 第一个标签页
	QWidget *tab1 = new QWidget();
	QVBoxLayout *tab1Layout = new QVBoxLayout(tab1);
	tab1Layout->addWidget(new QLabel("这是标签页 1 的内容"));
	tab1Layout->addWidget(new QPushButton("按钮 1"));
	tabWidget->addTab(tab1, "标签页 &1"); // 添加页面并设置标题
	// 第二个标签页
	QWidget *tab2 = new QWidget();
	tab2->setLayout(new QVBoxLayout()); // 需要设置布局才能添加控件
	tab2->layout()->addWidget(new QLabel("这是标签页 2"));
	tab2->layout()->addWidget(new QCheckBox("选项 A"));
	tabWidget->addTab(tab2, "标签页 &2");

	// --- QStackedWidget 示例 ---
	QStackedWidget *stackedWidget = new QStackedWidget();
	// 页面1
	QWidget *page1 = new QWidget();
	QVBoxLayout *page1Layout = new QVBoxLayout(page1);
	page1Layout->addWidget(new QLabel("这是堆叠页 1"));
	// 页面2
	QWidget *page2 = new QWidget();
	QVBoxLayout *page2Layout = new QVBoxLayout(page2);
	page2Layout->addWidget(new QLabel("这是堆叠页 2"));
	// 添加页面
	stackedWidget->addWidget(page1);
	stackedWidget->addWidget(page2);
	// 控制切换的按钮
	QPushButton *prevButton = new QPushButton("<< 上一页");
	QPushButton *nextButton = new QPushButton("下一页 >>");
	QHBoxLayout *stackControlLayout = new QHBoxLayout();
	stackControlLayout->addWidget(prevButton);
	stackControlLayout->addWidget(nextButton);
	// 连接按钮信号到 QStackedWidget 的槽
	QObject::connect(prevButton, &QPushButton::clicked, [&](){
		int currentIndex = stackedWidget->currentIndex();
		stackedWidget->setCurrentIndex((currentIndex - 1 + stackedWidget->count()) % stackedWidget->count()); // 循环切换
	});
	QObject::connect(nextButton, &QPushButton::clicked, [&](){
		int currentIndex = stackedWidget->currentIndex();
		stackedWidget->setCurrentIndex((currentIndex + 1) % stackedWidget->count()); // 循环切换
	});


	// --- QGroupBox 和 QFrame 示例 (简单展示) ---
	QGroupBox *groupBox = new QGroupBox("分组框标题");
	QVBoxLayout *groupBoxLayout = new QVBoxLayout(groupBox);
	groupBoxLayout->addWidget(new QLabel("组内的控件"));
	groupBox->setLayout(groupBoxLayout);

	QFrame *frame = new QFrame();
	frame->setFrameShape(QFrame::StyledPanel); // 设置边框形状
	frame->setFrameShadow(QFrame::Raised);    // 设置边框阴影
	frame->setMinimumHeight(50); // 给点高度看效果
	QVBoxLayout *frameLayout = new QVBoxLayout(frame);
	frameLayout->addWidget(new QLabel("Frame 中的内容"));
	frame->setLayout(frameLayout);


	// 主布局
	QVBoxLayout *mainLayout = new QVBoxLayout(&window);
	mainLayout->addWidget(new QLabel("--- QTabWidget ---"));
	mainLayout->addWidget(tabWidget);
	mainLayout->addWidget(new QLabel("--- QStackedWidget ---"));
	mainLayout->addWidget(stackedWidget);
	mainLayout->addLayout(stackControlLayout); // 添加切换按钮布局
	mainLayout->addWidget(new QLabel("--- QGroupBox ---"));
	mainLayout->addWidget(groupBox);
	mainLayout->addWidget(new QLabel("--- QFrame ---"));
	mainLayout->addWidget(frame);

	window.setLayout(mainLayout);
	window.resize(400, 600);
	window.show();

	return app.exec();
}
```

*   **代码解析:**
    1.  创建了一个 `QTabWidget`，并使用 `addTab()` 添加了两个 `QWidget` 作为页面，每个页面包含一些简单的控件。
    2.  创建了一个 `QStackedWidget`，并使用 `addWidget()` 添加了两个 `QWidget` 作为页面。
    3.  创建了两个按钮 (`prevButton`, `nextButton`) 用于控制 `QStackedWidget` 的页面切换。
    4.  连接按钮的 `clicked()` 信号到 Lambda 表达式，Lambda 内部调用 `QStackedWidget` 的 `currentIndex()` 获取当前页索引，并计算出上一页/下一页的索引，然后调用 `setCurrentIndex()` 来切换页面。使用了模运算 `% stackedWidget->count()` 来实现循环切换。
    5.  简单创建了 `QGroupBox` 和 `QFrame`，并设置了布局和子控件，展示了它们作为容器的基本用法。
    6.  使用 `QVBoxLayout` 将所有这些容器控件组织在主窗口中。



> [!TIP]
> `QTabWidget` 通过 `addTab(QWidget *page, const QString &label)` 添加页面。
> `QStackedWidget` 通过 `addWidget(QWidget *widget)` 添加页面，通过 `setCurrentIndex(int index)` 或 `setCurrentWidget(QWidget *widget)` 切换页面。它==**没有内置的切换控件**==，需要你提供（如按钮、列表等）。
> `QGroupBox` 和 `QFrame` 都可以用来组织控件，`QGroupBox` 带标题，更侧重逻辑分组；`QFrame` 更侧重视觉分隔和边框效果。


> [!BUG]
> **错误:** 向 `QTabWidget` 或 `QStackedWidget` 添加了一个没有设置布局 (`setLayout`) 的 `QWidget`，然后试图在这个 `QWidget` 上添加子控件。
> **后果:** 子控件可能不会显示，或者显示位置不正确。
> **解决:** 在将 `QWidget` 添加到 `QTabWidget` 或 `QStackedWidget` 之前，==**确保该 `QWidget` 已经设置了一个布局管理器**== (`QWidget::setLayout()`)。

> [!BUG]
> **错误:** 创建了 `QStackedWidget` 但忘记提供切换页面的机制（如按钮或列表）。
> **后果:** 用户无法切换到除默认页之外的其他页面。
> **解决:** 添加用于切换的控件（如 `QPushButton`, `QListWidget`, `QComboBox`），并将其信号连接到 `QStackedWidget` 的 `setCurrentIndex` 或 `setCurrentWidget` 槽。




## **3.2 布局管理器 (Layouts)**

==**布局管理器是 Qt GUI 设计的基石！**== 它们负责自动排列窗口中的控件，并在窗口大小改变时==**智能地调整控件的大小和位置**==。告别手动计算坐标和大小的痛苦吧！

*   **概念:**
    布局管理器 (`QLayout` 的子类) 是不可见的管理对象，它们接管其管理的窗口或容器控件内子控件的几何形状（位置和大小）。

*   **使用:**
    1.  创建布局管理器对象（如 `QHBoxLayout`, `QVBoxLayout`）。
    2.  将控件或其他布局使用 `addWidget()`, `addLayout()`, `addSpacing()`, `addStretch()` 添加到布局中。
    3.  ==**将布局管理器设置给父窗口或父控件 (`QWidget::setLayout())`**==。这是最关键的一步！



> [!CAUTION]
> ==**一个窗口或控件只能设置一个顶层布局管理器。**== 如果需要复杂的布局，可以通过==**布局嵌套**==来实现。
> 一旦一个控件被添加到一个布局中，==**布局管理器就拥有了对该控件几何属性的控制权**==。此时再手动调用控件的 `setGeometry()`, `move()`, `resize()` 通常是无效的或会被布局覆盖。



> [!BUG]
> **错误:** 创建了布局管理器，并向其添加了控件，但==**忘记调用 `QWidget::setLayout()`**== 将布局设置给窗口或父控件。
> **后果:** 布局不生效，控件可能堆叠在 (0,0) 位置或根本不显示。
> **解决:** 确保调用 `yourWindowOrWidget->setLayout(yourLayout);`。



### **3.2.1 QHBoxLayout (水平布局)**

*   **概念:** 将控件==**从左到右**==水平排列。
*   **使用:** `layout->addWidget(...)`

### **3.2.2 QVBoxLayout (垂直布局)**

*   **概念:** 将控件==**从上到下**==垂直排列。
*   **使用:** `layout->addWidget(...)`

### **3.2.3 QGridLayout (栅格布局)**

*   **概念:** 将控件放置在==**网格单元**==中。可以跨行跨列。非常适合需要精确对齐的复杂布局。
*   **使用:** `layout->addWidget(widget, row, column, rowSpan, columnSpan)`

### **3.2.4 QFormLayout (表单布局)**

*   **概念:** 专门用于==**创建两列表单**==（通常是“标签-输入框”对）。自动对齐标签和输入字段。
*   **使用:** `layout->addRow(QString label, QWidget *field)` 或 `layout->addRow(QWidget *label, QWidget *field)`

### **3.2.5 QSpacerItem (伸缩项)**

*   **概念:** ==**一个空的、可伸缩的空间**==。常用于在布局中==**“推开”**==其他控件，例如将按钮推到右侧或底部。
*   **使用:** 通过 `addSpacing()` 添加固定大小的间隔，或通过 `addStretch()` 添加==**可伸缩的弹簧**==（常用！）。
    *   `addSpacing(int size)`: 添加固定大小的空白。
    *   `addStretch(int stretch = 0)`: 添加一个弹簧。默认 `stretch` 因子为 0，表示它会尽可能多地占据空间。可以设置不同的 stretch 因子来按比例分配空间。

### **3.2.6 布局嵌套与管理**

*   **概念:** ==**可以将一个布局添加到另一个布局中**== (`parentLayout->addLayout(childLayout)`)。这是构建复杂界面的关键技术。
*   **使用:**

```cpp
#include <QApplication>
#include <QWidget>
#include <QPushButton>
#include <QLineEdit>
#include <QTextEdit>
#include <QHBoxLayout>
#include <QVBoxLayout>
#include <QGridLayout>
#include <QFormLayout>
#include <QSpacerItem> // 包含头文件

int main(int argc, char *argv[])
{
	QApplication app(argc, argv);

	QWidget window;
	window.setWindowTitle("布局管理器示例");

	// --- 顶部表单部分 (QFormLayout) ---
	QFormLayout *formLayout = new QFormLayout();
	QLineEdit *nameEdit = new QLineEdit();
	QLineEdit *emailEdit = new QLineEdit();
	formLayout->addRow("姓名(&N):", nameEdit);
	formLayout->addRow("邮箱(&E):", emailEdit);

	// --- 中间网格部分 (QGridLayout) ---
	QGridLayout *gridLayout = new QGridLayout();
	gridLayout->addWidget(new QPushButton("按钮 1"), 0, 0); // 第 0 行, 第 0 列
	gridLayout->addWidget(new QPushButton("按钮 2"), 0, 1); // 第 0 行, 第 1 列
	gridLayout->addWidget(new QPushButton("跨两列的按钮"), 1, 0, 1, 2); // 第 1 行, 第 0 列, 占 1 行, 占 2 列

	// --- 底部按钮部分 (QHBoxLayout + QSpacerItem) ---
	QHBoxLayout *bottomLayout = new QHBoxLayout();
	// 添加一个弹簧，将后面的按钮推到右边
	bottomLayout->addStretch(1); // ==**添加弹簧**==
	QPushButton *okButton = new QPushButton("确定");
	QPushButton *cancelButton = new QPushButton("取消");
	bottomLayout->addWidget(okButton);
	bottomLayout->addWidget(cancelButton);

	// --- 主布局 (QVBoxLayout 嵌套其他布局) ---
	QVBoxLayout *mainLayout = new QVBoxLayout(&window); // ==**直接在 window 上创建主布局**==
	mainLayout->addLayout(formLayout); // 添加表单布局
	mainLayout->addWidget(new QTextEdit("这是一个多行文本框，在不同布局之间")); // 添加单个控件
	mainLayout->addLayout(gridLayout); // 添加网格布局
	mainLayout->addStretch(1); // 在中间添加一个弹簧，使得底部按钮区域不会被拉伸太多
	mainLayout->addLayout(bottomLayout); // 添加底部按钮布局

	// window.setLayout(mainLayout); // 因为构造时传入了 &window，这句可以省略，但写上更清晰

	window.resize(400, 350);
	window.show();

	return app.exec();
}
```

*   **代码解析:**
    1.  创建了 `QFormLayout` 用于顶部的标签和输入框。
    2.  创建了 `QGridLayout` 用于中间的按钮网格，并演示了如何跨列放置控件。
    3.  创建了 `QHBoxLayout` 用于底部的“确定”和“取消”按钮。==**关键在于 `bottomLayout->addStretch(1)`**==，它在按钮前添加了一个可伸缩的空白（弹簧），这个弹簧会尽可能地占据多余的空间，从而将按钮推到布局的右侧。
    4.  创建了 `QVBoxLayout` 作为主布局，并==**依次将 `formLayout`、一个 `QTextEdit`、`gridLayout`、一个弹簧 (`addStretch`) 和 `bottomLayout` 添加到主布局中**==。实现了布局的嵌套。
    5.  在创建 `mainLayout` 时直接传入 `&window` 作为父对象，这等同于调用 `window.setLayout(mainLayout)`。



> [!TIP]
> `addStretch()` 是实现==**对齐（左对齐、右对齐、居中对齐）**==和==**空间分配**==的常用技巧。
> 嵌套布局时，想清楚控件的组织结构是关键。先水平分组还是先垂直分组？
> 可以为 `addWidget` 和 `addLayout` 提供第二个参数 `stretch` 因子，控制该项在布局方向上如何分配多余空间。`stretch` 值越大的项获得的额外空间越多。



> [!BUG]
> **错误:** 界面缩放时，控件大小不变或位置混乱。
> **后果:** UI 在不同屏幕尺寸或分辨率下表现糟糕。
> **解决:** ==**确保所有需要自适应调整的控件都包含在布局管理器中**==，并且顶层窗口或容器设置了主布局。不要混合使用布局和手动定位 (`setGeometry`)，除非你非常清楚自己在做什么。



## **3.3 主窗口 (QMainWindow)**

`QMainWindow` 是一个==**为现代应用程序提供标准框架**==的窗口类。它天生就支持菜单栏、工具栏、状态栏、中心部件和可停靠窗口。

*   **概念:**
    `QMainWindow` 提供了一个预定义好的窗口结构，方便开发者快速搭建功能完备的主界面。

*   **使用:**
    通常让你的主窗口类继承自 `QMainWindow`。


> [!NOTE]
> `QMainWindow` ==**不能直接设置布局管理器 (`setLayout`)**==。它有自己内部的布局结构。你需要创建一个普通的 `QWidget` 作为==**中心部件 (Central Widget)**==，然后在这个中心部件上设置布局。



> [!BUG]
> **错误:** 试图直接调用 `QMainWindow::setLayout()`。
> **后果:** 编译错误或运行时无效果/警告。
> **解决:** 创建一个 `QWidget` 实例，设置其布局，然后调用 `QMainWindow::setCentralWidget()` 将这个 `QWidget` 设置为中心部件。



### **3.3.1 菜单栏 (QMenuBar)**

*   **概念:** 位于窗口顶部的==**传统菜单区域**==（如“文件”、“编辑”、“帮助”）。
*   **使用:**
    通过 `QMainWindow::menuBar()` 获取菜单栏指针（如果不存在会自动创建），然后使用 `addMenu()` 添加菜单 (`QMenu`)，再使用 `addAction()` 向菜单中添加菜单项 (`QAction`)。

```cpp
// 在 QMainWindow 的构造函数或其他初始化函数中：
QMenu *fileMenu = menuBar()->addMenu("文件(&F)"); // 创建“文件”菜单
QAction *openAction = new QAction("打开(&O)", this); // 创建“打开”动作
fileMenu->addAction(openAction); // 将动作添加到菜单
// connect(openAction, &QAction::triggered, this, &MyMainWindow::openFile); // 连接动作的触发信号
```


> [!TIP]
> `QAction` 是==**命令动作的抽象**==，它包含了文本、图标、快捷键、状态提示等信息，并且有一个 `triggered()` 信号。==**菜单项、工具栏按钮、甚至快捷键都可以关联到同一个 `QAction`**==，实现逻辑复用。

### **3.3.2 工具栏 (QToolBar)**
*   **概念:** 通常位于菜单栏下方或窗口边缘的==**快捷按钮区域**==。
*   **使用:**
    通过 `QMainWindow::addToolBar()` 创建并添加工具栏 (`QToolBar`)。然后使用 `addAction()` 向工具栏添加动作 (`QAction`)，通常会显示为图标按钮。

```cpp
// 在 QMainWindow 的构造函数或其他初始化函数中：
QToolBar *fileToolBar = addToolBar("文件工具栏"); // 创建并添加工具栏
// 假设 openAction 已经在菜单栏部分创建好了
fileToolBar->addAction(openAction); // 将同一个动作添加到工具栏
// openAction->setIcon(QIcon(":/icons/open.png")); // 可以给动作设置图标
```

### **3.3.3 状态栏 (QStatusBar)**

*   **概念:** 位于窗口底部的==**信息显示区域**==，用于显示临时消息、永久信息（如行号、字数）等。
*   **使用:**
    通过 `QMainWindow::statusBar()` 获取状态栏指针（如果不存在会自动创建）。使用 `showMessage(const QString &message, int timeout = 0)` 显示临时消息（`timeout` 毫秒后自动消失，0 表示一直显示直到下次调用或清除），或使用 `addPermanentWidget(QWidget *widget)` 添加永久控件（如 `QLabel`）。

```cpp
// 显示临时消息
statusBar()->showMessage("加载完成", 3000); // 显示 3 秒

// 添加永久控件
QLabel *statusLabel = new QLabel("准备就绪");
statusBar()->addPermanentWidget(statusLabel);
// statusLabel->setText("正在处理..."); // 可以随时更新永久控件内容
```

### **3.3.4 中心部件 (Central Widget)**

*   **概念:** ==**`QMainWindow` 的核心内容区域**==。==**必须设置一个中心部件**==，否则主窗口区域是空的。
*   **使用:**
    创建一个 `QWidget`（或其他任何 `QWidget` 子类），在这个 `QWidget` 上设置你的主界面布局和控件，然后调用 `QMainWindow::setCentralWidget(yourWidget)`。

```cpp
// 在 QMainWindow 的构造函数或其他初始化函数中：
QWidget *centralArea = new QWidget(this); // 创建中心部件 (QWidget)
QVBoxLayout *centralLayout = new QVBoxLayout(centralArea); // 在中心部件上创建布局
centralLayout->addWidget(new QTextEdit()); // 添加你的主要控件到布局
// centralArea->setLayout(centralLayout); // 构造时传入父对象等同于此句
setCentralWidget(centralArea); // ==**设置中心部件**==
```

### **3.3.5 停靠窗口 (QDockWidget)**

*   **概念:** ==**可以停靠在主窗口边缘，也可以浮动为独立窗口**==的小窗口。常用于工具箱、属性编辑器等。
*   **使用:**
    创建 `QDockWidget` 对象，设置其标题和允许停靠的区域。创建一个 `QWidget` 作为 `QDockWidget` 的内容控件，并设置布局。最后使用 `QMainWindow::addDockWidget(Qt::DockWidgetArea area, QDockWidget *dockwidget)` 将停靠窗口添加到主窗口。

```cpp
// 在 QMainWindow 的构造函数或其他初始化函数中：
QDockWidget *dock = new QDockWidget("工具箱", this); // 创建停靠窗口
dock->setAllowedAreas(Qt::LeftDockWidgetArea | Qt::RightDockWidgetArea); // 设置允许停靠的区域

QWidget *toolboxWidget = new QWidget(); // 停靠窗口的内容控件
QVBoxLayout *toolboxLayout = new QVBoxLayout(toolboxWidget);
toolboxLayout->addWidget(new QPushButton("工具1"));
toolboxLayout->addWidget(new QPushButton("工具2"));
dock->setWidget(toolboxWidget); // ==**设置停靠窗口的内容**==

addDockWidget(Qt::LeftDockWidgetArea, dock); // ==**将停靠窗口添加到主窗口的左侧区域**==
```

*   **完整 `QMainWindow` 示例:**
```cpp
#include <QApplication>
#include <QMainWindow>
#include <QMenuBar>
#include <QMenu>
#include <QAction>
#include <QToolBar>
#include <QStatusBar>
#include <QTextEdit>
#include <QDockWidget>
#include <QLabel>
#include <QMessageBox> // 包含 QMessageBox

class MyMainWindow : public QMainWindow
{
	Q_OBJECT // 如果有自定义槽，需要加

public:
	MyMainWindow(QWidget *parent = nullptr) : QMainWindow(parent)
	{
		setWindowTitle("QMainWindow 示例");
		resize(800, 600);

		// ==**1. 创建动作 (QAction)**==
		QAction *newAction = new QAction(QIcon(), "&新建", this); // 图标留空，快捷键 Alt+N
		newAction->setShortcut(QKeySequence::New); // 标准快捷键 Ctrl+N
		newAction->setStatusTip("创建一个新文件"); // 状态栏提示
		connect(newAction, &QAction::triggered, this, &MyMainWindow::newFile); // 连接信号

		QAction *exitAction = new QAction("&退出", this);
		exitAction->setShortcut(QKeySequence::Quit); // 标准快捷键 Ctrl+Q
		exitAction->setStatusTip("退出应用程序");
		connect(exitAction, &QAction::triggered, qApp, &QApplication::quit); // 连接到全局退出槽

		// ==**2. 创建菜单栏**==
		QMenu *fileMenu = menuBar()->addMenu("&文件");
		fileMenu->addAction(newAction);
		fileMenu->addSeparator(); // 添加分隔线
		fileMenu->addAction(exitAction);

		// ==**3. 创建工具栏**==
		QToolBar *fileToolBar = addToolBar("文件");
		fileToolBar->addAction(newAction); // 复用动作

		// ==**4. 创建中心部件**==
		QTextEdit *textEdit = new QTextEdit(this);
		setCentralWidget(textEdit); // 设置为中心部件

		// ==**5. 创建停靠窗口**==
		QDockWidget *dock = new QDockWidget("信息窗口", this);
		dock->setAllowedAreas(Qt::LeftDockWidgetArea | Qt::RightDockWidgetArea);
		QLabel *infoLabel = new QLabel("这里显示一些信息...", dock); // DockWidget 作为父对象
		infoLabel->setAlignment(Qt::AlignCenter);
		dock->setWidget(infoLabel); // 设置 dock 的内容控件
		addDockWidget(Qt::RightDockWidgetArea, dock); // 添加到右侧

		// ==**6. 设置状态栏**==
		statusBar()->showMessage("准备就绪", 3000); // 临时消息
	}

private slots: // 如果 Q_OBJECT 存在，可以定义槽
	void newFile() {
		 QMessageBox::information(this, "提示", "触发了“新建文件”动作！");
		 // 实际应用中会清空 textEdit 或创建新窗口
		 // qobject_cast<QTextEdit*>(centralWidget())->clear();
	}
};

// 如果 MyMainWindow 在单独文件，需要包含 #include "MyMainWindow.h" 和 "main.moc"
#ifndef MAINWINDOW_H // 防止重定义，如果 MyMainWindow 在 .h 文件
#define MAINWINDOW_H
#include "main.moc" // 包含 MOC 文件
#endif

int main(int argc, char *argv[])
{
	QApplication app(argc, argv);
	MyMainWindow mainWindow;
	mainWindow.show();
	return app.exec();
}
```
*   **代码解析:**
    1.  创建了一个 `MyMainWindow` 类继承自 `QMainWindow`。
    2.  **动作 (QAction):** 创建了 `newAction` 和 `exitAction`，设置了文本、快捷键、状态提示，并连接了 `triggered` 信号。`newAction` 连接到自定义的 `newFile` 槽，`exitAction` 连接到全局的 `quit` 槽。
    3.  **菜单栏:** 获取 `menuBar()`，添加 "文件" 菜单，并将动作添加到菜单中。
    4.  **工具栏:** 调用 `addToolBar()` 创建工具栏，并将 `newAction` 添加到工具栏，实现了菜单和工具栏共享同一个动作。
    5.  **中心部件:** 创建了一个 `QTextEdit` 并通过 `setCentralWidget()` 设置为中心区域。
    6.  **停靠窗口:** 创建了 `QDockWidget`，设置了标题和允许区域，创建了一个 `QLabel` 作为其内容，并通过 `setWidget()` 设置，最后用 `addDockWidget()` 添加到主窗口右侧。
    7.  **状态栏:** 通过 `statusBar()` 获取并显示了一条临时消息。
    8.  **自定义槽:** 定义了 `newFile()` 槽，当 `newAction` 被触发时，弹出一个信息框。
    9.  `main` 函数中创建并显示 `MyMainWindow`。

---

## **3.4 标准对话框 (Dialogs)**

对话框 (`QDialog` 的子类) 是==**临时性的独立窗口**==，用于与用户进行短时间的交互，例如显示消息、请求输入、选择文件等。Qt 提供了一系列常用的==**标准对话框**==，可以直接通过==**静态函数**==调用，非常方便。

*   **概念:**
    预先定义好的、用于常见交互任务的对话框窗口。

*   **使用:**
    直接调用对应类的==**静态成员函数**==。这些函数通常是==**模态 (modal)**==的，意味着它们会==**阻塞**==调用它们的窗口，直到对话框关闭。它们会返回用户操作的结果（例如，点击了哪个按钮、选择了什么文件等）。


> [!TIP]
> 使用标准对话框可以使你的应用程序具有==**与操作系统一致的外观和行为**==，提升用户体验。
> ==**静态函数调用是最快捷方便的使用方式。**==



> [!BUG]
> **错误:** 调用了标准对话框的静态函数，但==**忽略了其返回值**==。
> **后果:** 无法知道用户的操作结果（例如，用户是点击了“确定”还是“取消”，选择了哪个文件）。
> **解决:** 检查静态函数的返回值。例如，`QMessageBox::question()` 返回 `QMessageBox::Yes` 或 `QMessageBox::No`；`QFileDialog::getOpenFileName()` 返回选择的文件路径字符串（如果取消则为空字符串）。

### **3.4.1 QMessageBox (消息对话框)**

*   **概念:** ==**显示提示、警告、错误、问题或关于信息**==。
*   **使用 (静态函数):**
    *   `QMessageBox::information(parent, title, text, buttons, defaultButton)`: 信息
    *   `QMessageBox::question(parent, title, text, buttons, defaultButton)`: 提问 (通常返回 Yes/No)
    *   `QMessageBox::warning(parent, title, text, buttons, defaultButton)`: 警告
    *   `QMessageBox::critical(parent, title, text, buttons, defaultButton)`: 严重错误
    *   `QMessageBox::about(parent, title, text)`: 关于信息


```cpp
// 在某个按钮的槽函数中
QMessageBox::StandardButton reply;
reply = QMessageBox::question(this, "确认操作", "您确定要删除这个文件吗?",
                              QMessageBox::Yes | QMessageBox::No, QMessageBox::No); // 按钮组合，默认按钮

if (reply == QMessageBox::Yes) {
    qDebug() << "用户选择了 Yes";
    // 执行删除操作...
} else {
    qDebug() << "用户选择了 No 或关闭了对话框";
}

QMessageBox::information(this, "提示", "操作已完成。");
```

### **3.4.2 QFileDialog (文件对话框)**

*   **概念:** ==**让用户选择文件或目录**==。
*   **使用 (静态函数):**
    *   `QFileDialog::getOpenFileName(parent, caption, dir, filter)`: 获取单个要打开的文件名。
    *   `QFileDialog::getOpenFileNames(parent, caption, dir, filter)`: 获取多个要打开的文件名。
    *   `QFileDialog::getSaveFileName(parent, caption, dir, filter)`: 获取要保存的文件名。
    *   `QFileDialog::getExistingDirectory(parent, caption, dir, options)`: 获取一个已存在的目录。


```cpp
// 获取单个文件
QString fileName = QFileDialog::getOpenFileName(this,
	"打开图像文件",                           // 对话框标题
	"/home",                                // 默认打开目录
	"图像文件 (*.png *.jpg *.bmp);;所有文件 (*.*)"); // 文件过滤器

if (!fileName.isEmpty()) {
	qDebug() << "用户选择了文件:" << fileName;
	// 加载文件...
} else {
	qDebug() << "用户取消了选择";
}

// 获取保存文件名
QString saveName = QFileDialog::getSaveFileName(this, "保存文件", "/home/untitled.txt", "文本文档 (*.txt)");
if (!saveName.isEmpty()) {
	qDebug() << "用户指定保存路径:" << saveName;
	// 保存文件...
}
```

 
### **3.4.3 QColorDialog (颜色对话框)**

*   **概念:** ==**让用户选择颜色**==。
*   **使用 (静态函数):**
    *   `QColorDialog::getColor(initial, parent, title, options)`: 获取用户选择的颜色。

```cpp
QColor initialColor = Qt::white; // 初始颜色
QColor selectedColor = QColorDialog::getColor(initialColor, this, "选择背景颜色");

if (selectedColor.isValid()) { // 检查用户是否选择了有效颜色（而不是取消）
	qDebug() << "用户选择了颜色:" << selectedColor.name();
	// 应用颜色... (例如设置窗口背景色)
	// QPalette pal = palette();
	// pal.setColor(QPalette::Window, selectedColor);
	// setPalette(pal);
	// setAutoFillBackground(true);
} else {
	qDebug() << "用户取消了颜色选择";
}
```

### **3.4.4 QFontDialog (字体对话框)**

*   **概念:** ==**让用户选择字体**==。
*   **使用 (静态函数):**
    *   `QFontDialog::getFont(&ok, initial, parent, title, options)`: 获取用户选择的字体。

```cpp
bool ok;
QFont initialFont = font(); // 获取当前控件的字体作为初始字体
QFont selectedFont = QFontDialog::getFont(&ok, initialFont, this, "选择字体");

if (ok) { // 检查用户是否点击了“确定”
	qDebug() << "用户选择了字体:" << selectedFont.family() << "大小:" << selectedFont.pointSize();
	// 应用字体... (例如设置 QLabel 的字体)
	// myLabel->setFont(selectedFont);
} else {
	qDebug() << "用户取消了字体选择";
}
```

### **3.4.5 QInputDialog (输入对话框)**

*   **概念:** ==**获取用户输入的单个值**==（字符串、整数、浮点数或列表选项）。
*   **使用 (静态函数):**
    *   `QInputDialog::getText(parent, title, label, echo, text, &ok)`: 获取字符串。
    *   `QInputDialog::getInt(parent, title, label, value, min, max, step, &ok)`: 获取整数。
    *   `QInputDialog::getDouble(parent, title, label, value, min, max, decimals, &ok)`: 获取浮点数。
    *   `QInputDialog::getItem(parent, title, label, items, current, editable, &ok)`: 从列表中选择一项。

```cpp
bool ok;
// 获取文本
QString text = QInputDialog::getText(this, "输入对话框", "请输入您的名字:", QLineEdit::Normal, "", &ok);
if (ok && !text.isEmpty()) {
	qDebug() << "用户输入了名字:" << text;
}

// 获取整数
int age = QInputDialog::getInt(this, "输入对话框", "请输入您的年龄:", 25, 0, 120, 1, &ok);
if (ok) {
	qDebug() << "用户输入了年龄:" << age;
}

// 从列表选择
QStringList items;
items << "春天" << "夏天" << "秋天" << "冬天";
QString item = QInputDialog::getItem(this, "选择对话框", "选择一个季节:", items, 0, false, &ok);
if (ok && !item.isEmpty()) {
	qDebug() << "用户选择了季节:" << item;
}
```

### **3.4.6 QProgressDialog (进度对话框)**

*   **概念:** ==**显示一个带进度条和取消按钮的模态对话框**==，用于反馈耗时操作的进度。它会自动判断操作时间，如果时间很短，则不会显示自己，避免闪烁。
*   **使用:**
    需要创建 `QProgressDialog` 对象实例。

```cpp
int numTasks = 10000; // 假设总任务量
QProgressDialog progress("正在处理中...", "取消", 0, numTasks, this); // 创建对话框
progress.setWindowModality(Qt::WindowModal); // 设置为窗口模态
progress.setMinimumDuration(500); // 操作超过 500ms 才显示对话框
progress.setValue(0); // 初始值

for (int i = 0; i < numTasks; ++i) {
	// 执行你的耗时任务的一小部分...
	// QThread::msleep(1); // 模拟耗时

	progress.setValue(i); // ==**更新进度**==

	// ==**检查用户是否点击了取消按钮**==
	if (progress.wasCanceled()) {
		qDebug() << "操作被用户取消";
		break;
	}
	QCoreApplication::processEvents(); // ==**重要：处理事件，让对话框响应**== (如果在 GUI 线程执行)
}
progress.setValue(numTasks); // 确保最后设置为最大值
qDebug() << "处理完成";

// 注意：如果耗时操作在工作线程，需要通过信号槽更新 progress.setValue()
```
*   **代码解析:**
    1.  创建 `QProgressDialog` 实例，设置标题、取消按钮文本、范围和父对象。
    2.  `setWindowModality(Qt::WindowModal)` 使对话框阻塞当前窗口。
    3.  `setMinimumDuration(500)` 设置了一个阈值，只有当预计操作时间超过 500 毫秒时，对话框才会真正显示出来，避免短暂操作也弹框打扰用户。
    4.  在循环中执行任务，并调用 `progress.setValue(i)` 更新进度条。
    5.  ==**非常重要：**== 在循环内部检查 `progress.wasCanceled()` 来响应用户的取消操作。
    6.  ==**同样重要：**== 如果这个循环是在 GUI 线程中执行（通常不推荐用于真正耗时的任务），需要调用 `QCoreApplication::processEvents()` 来让 Qt 有机会处理事件，否则对话框会卡住，无法更新进度或响应取消按钮。更好的做法是将耗时任务放在工作线程。



> [!CAUTION]
> 对于真正耗时的操作，==**强烈建议将其放入工作线程**==，然后通过信号将进度更新发送回主线程，在主线程的槽函数中调用 `QProgressDialog::setValue()`。直接在 GUI 线程执行长时间循环并频繁调用 `processEvents()` 可能会导致其他问题。



## **3.5 自定义对话框**

当标准对话框无法满足特定需求时，我们可以创建自己的对话框。

*   **概念:**
    通过继承 `QDialog` 类来创建具有特定布局和功能的自定义对话框窗口。

*   **使用:**
    1.  创建一个新类，继承自 `QDialog`。
    2.  在该类的构造函数中，像设计普通 `QWidget` 一样，添加所需的控件和布局。
    3.  通常会添加标准的按钮（如“确定”、“取消”），可以使用 `QDialogButtonBox` 方便地创建标准按钮行。
    4.  连接按钮的信号（例如 `QDialogButtonBox` 的 `accepted()` 和 `rejected()` 信号）到 `QDialog` 的 `accept()` 和 `reject()` 槽。
    5.  提供公共方法来设置对话框的初始数据，以及获取用户输入的数据。
    6.  在需要的地方创建自定义对话框对象，并调用 `exec()` 以==**模态**==方式显示，或调用 `show()` 以==**非模态**==方式显示。`exec()` 会返回 `QDialog::Accepted` 或 `QDialog::Rejected`。

*   **示例 (结构骨架):**

```cpp
// 头文件 MyCustomDialog.h
#ifndef MYCUSTOMDIALOG_H
#define MYCUSTOMDIALOG_H

#include <QDialog>
// 可能需要的其他控件头文件
#include <QLineEdit>
#include <QDialogButtonBox> // 标准按钮盒

namespace Ui { // 如果使用 .ui 文件
	class MyCustomDialog;
}

class MyCustomDialog : public QDialog
{
	Q_OBJECT

public:
	explicit MyCustomDialog(QWidget *parent = nullptr);
	~MyCustomDialog(); // 如果使用 .ui 文件

	// 公共接口，用于获取用户输入
	QString getName() const;
	int getAge() const;

// 可以添加 public slots: 或 private slots:
// private slots: void on_okButton_clicked(); // 示例槽

private:
	// 如果不使用 .ui 文件，在这里声明你的控件指针
	QLineEdit *nameEdit;
	QLineEdit *ageEdit; // 假设用 QLineEdit 输入年龄，更好的选择是 QSpinBox
	QDialogButtonBox *buttonBox;

	Ui::MyCustomDialog *ui; // 如果使用 .ui 文件
};

#endif // MYCUSTOMDIALOG_H

// 源文件 MyCustomDialog.cpp
#include "MyCustomDialog.h"
#include <QVBoxLayout>
#include <QFormLayout>
#include <QPushButton>
#include <QSpinBox> // 更好的年龄输入控件

// 如果使用 .ui 文件，需要包含对应的 ui_*.h
// #include "ui_MyCustomDialog.h"

MyCustomDialog::MyCustomDialog(QWidget *parent) :
	QDialog(parent)
	// 如果使用 .ui 文件: , ui(new Ui::MyCustomDialog)
{
	// 如果使用 .ui 文件:
	// ui->setupUi(this);
	// connect(ui->buttonBox, &QDialogButtonBox::accepted, this, &MyCustomDialog::accept);
	// connect(ui->buttonBox, &QDialogButtonBox::rejected, this, &MyCustomDialog::reject);
	// nameEdit = ui->nameLineEdit; // 获取 .ui 文件中定义的控件指针
	// ageEdit = ui->ageLineEdit;

	// --- 如果不使用 .ui 文件 ---
	setWindowTitle("自定义对话框");

	nameEdit = new QLineEdit(this);
	// ageEdit = new QLineEdit(this); // 改用 QSpinBox
	QSpinBox* ageSpinBox = new QSpinBox(this); // 使用 QSpinBox 更合适
	ageSpinBox->setRange(0, 120);

	// 使用表单布局
	QFormLayout *formLayout = new QFormLayout;
	formLayout->addRow("姓名:", nameEdit);
	formLayout->addRow("年龄:", ageSpinBox); // 使用 SpinBox

	// 标准按钮盒
	buttonBox = new QDialogButtonBox(QDialogButtonBox::Ok | QDialogButtonBox::Cancel, this);
	connect(buttonBox, &QDialogButtonBox::accepted, this, &QDialog::accept); // 连接 accepted 信号到 accept 槽
	connect(buttonBox, &QDialogButtonBox::rejected, this, &QDialog::reject); // 连接 rejected 信号到 reject 槽

	// 主布局
	QVBoxLayout *mainLayout = new QVBoxLayout(this);
	mainLayout->addLayout(formLayout);
	mainLayout->addWidget(buttonBox);

	setLayout(mainLayout);
	// --- 不使用 .ui 文件部分结束 ---

	// 初始化或设置默认值可以在这里做
	nameEdit->setPlaceholderText("请输入姓名");
}

// 如果使用 .ui 文件，需要实现析构函数删除 ui 对象
MyCustomDialog::~MyCustomDialog()
{
	// delete ui; // 如果使用了 .ui 文件
}


// 实现获取用户输入的公共方法
QString MyCustomDialog::getName() const
{
	// if (ui) return ui->nameLineEdit->text(); // .ui 方式
	return nameEdit->text(); // 手动创建方式
}

int MyCustomDialog::getAge() const
{
	// if (ui) return ui->ageSpinBox->value(); // .ui 方式 (假设 .ui 里用了 QSpinBox)
	// 注意：这里需要找到布局中的 QSpinBox，或者将其保存为成员变量
	// 更好的做法是将 ageSpinBox 保存为成员变量
	// return ageSpinBox->value(); // 假设 ageSpinBox 是成员变量
	// 临时的查找方式 (不推荐，但用于演示)
	QSpinBox* spinBox = findChild<QSpinBox*>();
	if (spinBox) return spinBox->value();
	return -1; // 或抛出异常
}


// --- 如何使用自定义对话框 ---
/*
#include "MyCustomDialog.h" // 包含头文件
#include <QDebug>

void showMyDialog(QWidget *parent) {
	MyCustomDialog dialog(parent);
	// dialog.setInitialData(...); // 如果需要设置初始值

	// 以模态方式显示对话框，并等待用户响应
	if (dialog.exec() == QDialog::Accepted) {
		// 用户点击了“确定”
		QString name = dialog.getName();
		int age = dialog.getAge();
		qDebug() << "用户输入: Name =" << name << ", Age =" << age;
		// 处理用户输入的数据...
	} else {
		// 用户点击了“取消”或关闭了对话框
		qDebug() << "用户取消了操作";
	}
}
*/
```

*   **代码解析 (非 .ui 部分):**
    1.  类 `MyCustomDialog` 继承自 `QDialog`。
    2.  构造函数中创建了 `QLineEdit` 和 `QSpinBox` 用于输入。
    3.  使用 `QFormLayout` 排列输入控件。
    4.  创建了 `QDialogButtonBox`，并指定了 `Ok` 和 `Cancel` 按钮。
    5.  ==**关键连接：**== 将 `buttonBox` 的 `accepted()` 信号连接到 `QDialog` 内置的 `accept()` 槽，`rejected()` 信号连接到 `reject()` 槽。当用户点击 "Ok" 时，`accept()` 槽被调用，这会使 `exec()` 返回 `QDialog::Accepted` 并关闭对话框。点击 "Cancel" 则调用 `reject()` 槽，使 `exec()` 返回 `QDialog::Rejected` 并关闭对话框。
    6.  使用 `QVBoxLayout` 作为主布局。
    7.  提供了 `getName()` 和 `getAge()` 公共成员函数，用于在对话框被接受后，从外部获取用户输入的值。注意 `getAge` 的实现，直接查找子控件不是最佳实践，最好将 `ageSpinBox` 存为成员变量。
    8.  注释掉的 `showMyDialog` 函数演示了如何创建并使用这个自定义对话框：创建实例，调用 `exec()` 显示，然后根据返回值判断用户操作并获取数据。

*   **注意事项:**

> [!TIP]
> ==**模态 (`exec()`) vs 非模态 (`show()`)**==:
> *   `exec()` 显示对话框并==**阻塞**==代码执行，直到对话框关闭。通常用于需要用户立即完成输入的场景。返回 `QDialog::Accepted` 或 `QDialog::Rejected`。
> *   `show()` 显示对话框但==**不阻塞**==代码执行，程序继续运行。适用于可以和主窗口同时存在的对话框（如查找替换）。需要使用信号槽机制来处理对话框关闭或数据准备好的事件。

> [!NOTE]
> 使用 Qt Creator 的设计模式可以==**非常方便地通过拖拽来设计自定义对话框的界面 (.ui 文件)**==，然后通过 `uic` 工具生成代码或在代码中加载 `.ui` 文件。这种方式可以大大提高开发效率，推荐学习使用。上面的代码也展示了使用 `.ui` 文件时的基本结构。



> [!BUG]
> **错误:** 创建了自定义对话框，显示后（尤其是用 `exec()`），忘记提供获取用户输入数据的公共接口，或者在对话框对象销毁后才尝试获取数据。
> **后果:** 无法获取用户的输入。
> **解决:** 在对话框类中提供清晰的公共 getter 方法（如 `getName()`, `getSelectedOptions()` 等），并在调用 `exec()` 后、对话框对象仍然有效时，立即通过这些方法获取数据。

> [!BUG]
> **错误:** 对于非模态对话框 (`show()`)，没有正确处理其关闭事件或数据传递。
> **后果:** 主窗口可能不知道对话框何时关闭，或者无法在其关闭时获取数据。
> **解决:** 连接自定义对话框的 `finished(int result)` 信号，或者自定义信号（例如 `dataReady(YourData)`），在对话框准备好数据或关闭时发射信号，让主窗口或其他相关对象响应。



朋友们，掌握了这些 GUI 基础知识，你就有了构建 Qt 应用程序界面的“砖瓦”和“蓝图”。从简单的按钮到结构化的主窗口，再到与用户交互的对话框，这些都是我们日常开发中频繁使用的元素。

==**记住，布局管理器是构建灵活、自适应界面的关键！**== 多加练习，尝试组合不同的控件和布局，你会发现创建漂亮又实用的 GUI 并不难。下一章，我们可能会深入探讨更高级的 GUI 主题，比如模型/视图编程、图形绘制等。继续加油！
