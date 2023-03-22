接下来我们一起分析一下HelloWorld项目究竟是怎么运行起来的吧。首先打开**Android-Manifest.xml**文件，从中可以找到如下代码：

```xml
<activity android:name=".HelloWorldActivity">
	<intent-filter>
		<action android:name="android.intent.action.MAIN" />
		<category android:name="android.intent.category.LAUNCHER" />
	</intent-filter>
</activity>
```

这段代码表示对HelloWorldActivity这个活动进行注册，没有在**AndroidManifest.xml**里注册的活动是不能使用的。其中**intent-filter**里的两行代码非常重要，和表示HelloWorldActivity是这个项目的主活动，在手机上点击应用图标，首先启动的就是这个活动。

那HelloWorldActivity具体又有什么作用呢？我在介绍Android四大组件的时候说过，活动是Android应用程序的门面，凡是在应用中你看得到的东西，都是放在活动中的。打开HelloWorldActivity，代码如下所示：

```java
public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }
}
```

**HelloWorldActivity**是继承自**AppCompatActivity**的，这是一种**向下兼容的Activity**，可以将Activity在各个系统版本中增加的特性和功能最低兼容到Android 2.1系统。**Activity是Android系统提供的一个活动基类，我们项目中所有的活动都必须继承它或者它的子类才能拥有活动的特性**（**AppCompatActivity是Activity的子类**）。然后可以看到HelloWorldActivity中有一个`onCreate()`方法，这个方法是一个活动被创建时必定要执行的方法，其中只有两行代码，并且没有Hello World！的字样

其实Android程序的设计讲究逻辑和视图分离，因此是不推荐在活动中直接编写界面的，更加通用的一种做法是，在布局文件中编写界面，然后在活动中引入进来。可以看到，在`onCreate()`方法的第二行调用了`setContentView()`方法，就是这个方法给当前的活动引入了一个**activity_main**布局，那Hello World！一定就是在这里定义的了

布局文件都是定义在res/layout目录下的，当你展开layout目录，你会看到hello_world_layout.xml这个文件。打开该文件并切换到Text视图，代码如下所示：

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello World!"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

后面我会对布局进行详细讲解的，你现在只需要看到上面代码中有一个**TextView**，**这是Android系统提供的一个控件**，用于在布局中显示文字的。然后你终于在TextView中看到了Hello World！的字样！哈哈！终于找到了，原来就是通过`android:text="Hello World! "`这句代码定义的

## 详解项目中的资源

![[Pasted image 20230313143245.png]]  
所有以drawable开头的文件夹都是**用来放图片的**，所有以mipmap开头的文件夹都是用来**放应用图标的**，所有以values开头的文件夹都是用来**放字符串、样式、颜色等配置的**，layout文件夹是用来**放布局文件**的。

![[Pasted image 20230313143750.png]]  
**mipmap**开头的文件夹，其实主要是为了让程序能够更好地兼容各种设备。**drawable**文件夹也是相同的道理，虽然Android Studio没有帮我们自动生成，但是我们应该自己创建**drawable-hdpi**、**drawable-xhdpi**、**drawable-xxhdpi**等文件夹。在制作程序的时候最好能够给同一张图片提供几个不同分辨率的版本，分别放在这些文件夹下，然后当程序运行的时候，会自动根据当前运行设备分辨率的高低选择加载哪个文件夹下的图片。当然这只是理想情况，更多的时候美工只会提供给我们一份图片，这时你就把所有图片都放在drawable-xxhdpi文件夹下就好了。

知道了res目录下每个文件夹的含义，我们再来看一下如何去使用这些资源吧。打开**res/values/strings.xml**文件，内容如下所示：

```xml
<resources>  
    <string name="app_name">My Application</string>  
</resources>
```

可以看到，这里定义了一个**应用程序名**的字符串，我们有以下两种方式来引用它。

-   在代码中通过`R.string.app_name`可以获得该字符串的引用。
-   在XML中通过`@string/app_name`可以获得该字符串的引用。

基本的语法就是上面这两种方式，其中string部分是可以替换的，如果是引用的**图片资源**就可以替换成`drawable`，如果是引用的**应用图标**就可以替换成`mipmap`，如果是引用的**布局文件**就可以替换成`layout`

下面举一个简单的例子来帮助你理解，打开**AndroidManifest.xml**文件，找到如下代码：

```xml
<application
	android:allowBackup="true"  
	android:dataExtractionRules="@xml/data_extraction_rules"  
	android:fullBackupContent="@xml/backup_rules"  
	android:icon="@mipmap/ic_launcher"  
	android:label="@string/app_name"  
	android:supportsRtl="true"  
	android:theme="@style/Theme.MyApplication"  
	tools:targetApi="31">
	...
</application>
```

HelloWorld项目的应用图标就是通过`android:icon`属性来指定的，应用的名称则是通过`android:label`属性指定的。可以看到，这里对资源引用的方式正是我们刚刚学过的在XML中引用资源的语法。

## 详解build.gradle文件

不同于Eclipse, Android Studio是采用Gradle来构建项目的。Gradle是一个非常先进的项目构建工具，它使用了一种基于Groovy的领域特定语言（DSL）来声明项目设置，摒弃了传统基于XML（如Ant和Maven）的各种烦琐配置。

HelloWorld项目中有两个**build.gradle**文件，**一个是在最外层目录下的，一个是在app目录下的**。这两个文件对构建Android Studio项目都起到了至关重要的作用，下面我们就来对这两个文件中的内容进行详细的分析。

### Android闭包解析

```js
plugins {
    id 'com.android.application'
}

android {
    namespace 'com.example.myapplication'
    compileSdk 33

    defaultConfig {
        applicationId "com.example.myapplication"
        minSdk 24
        targetSdk 33
        versionCode 1
        versionName "1.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}
```

这个文件中的内容就要相对复杂一些了，下面我们一行行地进行分析。首先第一行应用了一个插件，一般有两种值可选：`com.android.application`表示这是一个**应用程序模块**，`com.android.library`表示这是一个**库模块**。应用程序模块和库模块的**最大区别在于，一个是可以直接运行的，一个只能作为代码库依附于别的应用程序模块来运行**。

```js
defaultConfig {
        applicationId "com.example.myapplication"
        minSdk 24
        targetSdk 33
        versionCode 1
        versionName "1.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
}
```

然后我们看到，这里在android闭包中又嵌套了一个 **`defaultConfig`闭包**，`defaultConfig`闭包中可以对项目的更多细节进行配置。  
其中，applicationId用于指定项目的包名，前面我们在创建项目的时候其实已经指定过包名了，如果你想在后面对其进行修改，那么就是在这里修改的。  
`minSdkVersion`用于指定项目最低兼容的Android系统版本，这里指定成24表示最低兼容到Android 7.0系统。  
`targetSdkVersion`指定的值表示你在该目标版本上已经做过了充分的测试，系统将会为你的应用程序启用一些最新的功能和特性。比如说Android 6.0系统中引入了运行时权限这个功能，如果你将`targetSdkVersion`指定成23或者更高，那么系统就会为你的程序启用运行时权限功能，而如果你将`targetSdkVersion`指定成22，那么就说明你的程序最高只在Android 5.1系统上做过充分的测试，Android 6.0系统中引入的新功能自然就不会启用了。  
剩下的两个属性都比较简单，`versionCode`用于指定项目的版本号，`versionName`用于指定项目的版本名,这两个属性在生成安装文件的时候非常重要，我们在后面都会学到。

```js
buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
```

我们看一下`buildTypes`闭包。`buildTypes`闭包中用于指定生成安装文件的相关配置，**通常只会有两个子闭包，一个是_debug_，一个是_release_**。  
**debug闭包**用于指定生成测试版安装文件的配置，release闭包用于指定生成正式版安装文件的配置。  
另外，**debug闭包是可以忽略不写的**，因此我们看到上面的代码中就只有一个release闭包。

下面来看一下***release闭包***中的具体内容吧  
`minifyEnabled`用于指定是否对项目的代码进行混淆，true表示混淆，false表示不混淆。  
`proguardFiles`用于指定混淆时使用的规则文件，这里指定了两个文件

-   **第一个`proguard-android.txt`是在Android SDK目录下**的，里面是**所有项目通用的混淆规则**
-   **第二个`proguard-rules.pro`是在当前项目的根目录下**的，里面可以编写**当前项目特有的混淆规则**。
-   需要注意的是，通过Android Studio直接运行项目生成的都是测试版安装文件

### dependencies闭包解析

```js
dependencies {
    implementation 'androidx.appcompat:appcompat:1.4.1'
    implementation 'com.google.android.material:material:1.5.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.3'
    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.3'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.4.0'
}
```

这样整个android闭包中的内容就都分析完了，接下来还剩一个**dependencies闭包**。_**这个闭包的功能非常强大，它可以指定当前项目所有的依赖关系**_。

通常Android Studio项目一共有3种依赖方式：**本地依赖**、**库依赖**和**远程依赖**。

本地依赖可以对本地的Jar包或目录添加依赖关系，库依赖可以对项目中的库模块添加依赖关系，远程依赖则可以对jcenter库上的开源项目添加依赖关系。

观察一下dependencies闭包中的配置，`implementation`则是**远程依赖声明**，`androidx.appcompat:appcompat:1.4.1`就是一个标准的远程依赖库格式，其中**androidx.appcompat**是域名部分，用于和其他公司的库做区分；appcompat是工程名部分，用于和同一个公司中不同的库工程做区分；1.4.1是版本号，用于和同一个库不同的版本做区分。加上这句声明后，Gradle在构建项目时会首先检查一下本地是否已经有这个库的缓存，如果没有的话则会自动联网下载，然后再添加到项目的构建路径中。

至于**库依赖声明**这里**没有用到**，它的基本格式是**implementation project**后面加上要依赖的库的名称，比如有一个库模块的名字叫helper，那么添加这个库的依赖关系只需要加入`implementation project(':helper')`这句声明即可

另外剩下的`testImplementation`和`androidTestImplementation`都是用于**声明测试用例库**的，这个我们暂时用不到，先忽略它就可以了。

# 日记工具的使用

## 使用Android的日志工具

Android中的日志工具类是Log（android.util.Log），这个类中提供了如下5个方法来供我们打印日志。

-   `Log.v()`。用于打印那些最为琐碎的、意义最小的日志信息。对应级别verbose，是Android日志里面级别最低的一种。
-   `Log.d()。`用于打印一些调试信息，这些信息对你调试程序和分析问题应该是有帮助的。对应级别debug，比verbose高一级。
-   `Log.i()`。用于打印一些比较重要的数据，这些数据应该是你非常想看到的、可以帮你分析用户行为数据。对应级别info，比debug高一级。
-   `Log.w()`。用于打印一些警告信息，提示程序在这个地方可能会有潜在的风险，最好去修复一下这些出现警告的地方。对应级别warn，比info高一级。
-   `Log.e()`。用于打印程序中的错误信息，比如程序进入到了catch语句当中。当有错误信息打印出来的时候，一般都代表你的程序出现严重问题了，必须尽快修复。对应级别error，比warn高一级。

打开HelloWorldActivity，在onCreate()方法中添加一行打印日志的语句，如下所示：

```java
protected void onCreate(Bundle savedInstanceState) {
	super.onCreate(savedInstanceState);
	setContentView(R.layout.hello_world_layout);
	Log.d("HelloWorldActivity", "onCreate execute");
}
```

> `Log.d()`方法中传入了两个参数：  
> 第一个参数是tag，一般传入当前的类名就好，主要用于对打印信息进行过滤；  
> 第二个参数是msg，即想要打印的具体的内容。

现在可以重新运行一下HelloWorld这个项目了，点击顶部工具栏上的运行按钮，或者使用快捷键`Shift + F10`（Mac系统是control + R），等程序运行完毕，点击Android Studio底部工具栏的Android Monitor，在logcat中就可以看到打印信息了

## 为什么使用Log而不使用System.out