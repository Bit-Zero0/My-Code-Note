
# Spring是什么?
Spring 是一款主流的 Java EE 轻量级开源框架 ，Spring 由“Spring 之父”Rod Johnson 提出并创立，其目的是用于简化 Java 企业级应用的开发难度和开发周期。Spring的用途不仅限于服务器端的开发。从简单性、可测试性和松耦合的角度而言，任何Java应用都可以从Spring中受益。Spring 框架除了自己提供功能外，还提供整合其他技术和框架的能力。

Spring 自诞生以来备受青睐，一直被广大开发人员作为 Java 企业级应用程序开发的首选。时至今日，Spring 俨然成为了 Java EE 代名词，成为了构建 Java EE 应用的事实标准。


>我们通常所说的 Spring 指的是 Spring Framework（Spring 框架），它是一个开源框架，有着活跃庞大的社区，这就是它之所以能长久不衰的原因。Spring 持 泛的应用场景，它可以让 Java 企业级的应用程序开发起来更简单。

用一句话概括 Spring：Spring 是包含了众多工具方法的 **IoC 容器**。


## IoC容器是什么?
Spring 也是一个容器，Spring 是什么容器呢？Spring 是 个 IoC 容器。

什么是 IoC？
>IoC = Inversion of Control 翻译成中文是“控制反转”的意思，也就是说 Spring 是 个“控制反转”的容器，指把创建对象过程交给 Spring 进行管理。


## AOP
**AOP**：Aspect Oriented Programming 的简写，译为“面向切面编程”。AOP 用来封装多个类的公共行为，将那些与业务无关，却为业务模块所共同调用的逻辑封装起来，减少系统的重复代码，降低模块间的耦合度。另外，AOP 还解决一些系统层面上的问题，比如日志、事务、权限等。


# 为什么要学 Spring?
假如现在构建一辆“车”的程序，我们的实现思路是这样的:
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230514195322.png)

构建一辆车(Car Class)，然而车需要依赖车身(FrameWork Class),而车身需要依赖底盘
Bottom Class)，而底盘需要依赖轮胎（Tire Class)

最终程序的实现代码如下:
```java
public class test {  
    public static void main(String[] args) {  
		Car car = new Car(20);  
		car.init();
    }  
  
    //汽车对象  
    static class Car{  
    
        public void init(){  
            // 依赖车身  
            Framework framework = new Framework();  
            framework.init();  
        }  
    }  
  
    //车身类  
    static class Framework{  
        public void init(){  
            // 依赖底盘  
            Bottom bottom = new Bottom();  
            bottom.init();  
        }  
    }  
      
    //底盘类  
    static class Bottom{  
        public void init(){  
            //依赖轮胎  
            Tire tire = new Tire();  
            tire.init();  
        }  
    }  
  
    //轮胎类  
    static class Tire{  
        private int size = 30;//尺寸  
  
        public void init(){  
            System.out.println("轮胎尺寸:"+ size);  
        }  
    }  
}
```

**传统程序开发的缺陷**
以上程序中，轮胎的尺寸的固定的，然而随着对的车的需求量越来越大，个性化需求也会越来越多，这时候我们就需要加工多种尺寸的轮胎，那这个时候就要对上面的程序进行修改了。修改后的代码如下所示:
```java
public class test {  
    public static void main(String[] args) {  
        Car car = new Car(20);  
        car.run();  
    }  
  
    //汽车对象  
    static class Car{  
        private Framework framework;  
  
        public Car(int size){  
            // 依赖车身  
            framework = new Framework(size);  
        }  
  
        public void run(){  
            framework.init();  
        }  
    }  
  
    //车身类  
    static class Framework{  
        private Bottom bottom;  
  
        public Framework(int size){  
            bottom = new Bottom(size);  
        }  
  
        public void init(){  
            // 依赖底盘  
            bottom.init();  
        }  
    }  
  
    //底盘类  
    static class Bottom{  
        private Tire  tire;  
        public Bottom(int size){  
            //依赖轮胎  
            tire = new Tire(size);  
        }  
  
        public void init(){  
            tire.init();  
        }  
    }  
  
    //轮胎类  
    static class Tire{  
        private int size = 30;//尺寸  
  
        public Tire(int size){  
            this.size = size;  
        }  
  
        public void init(){  
            System.out.println("轮胎尺寸:"+ size);  
        }  
    }  
}
```
从以上代码可以看出，**以上程序的问题是:当最底层代码改动之后，整个调用链上的所有代码都
需要修改**。

## 解决传统开发中的缺陷
如何解决上述问题呢?
我们可以尝试不在每个类中自己创建下级类，如果自己创建下级类就会出现当下级类发生改变操作，自己也要跟着修改。
此时，我们只需要将原来由自己创建的下级类，改为传递的方式（也就是注入的方式)，因为我们不需要在当前类中创建下级类了，所以下级类即使发生变化（创建或减少参数)，当前类本身也无需修改任何代码，这样就完成了程序的解耦。

>PS:解耦指的是解决了代码的耦合性，耦合性也可以换一种叫法叫程序相关性。好的程序代码的耦合性（代码之间的相关性)是很低的，也就是代码之间要实现解耦。

这就好比我们打造一辆完整的汽车，如果所有的配件都是自己造，那么当客户需求发生改变的时候，比如轮胎的尺寸不再是原来的尺寸了，那我们要自己动手来改了，但如果我们是把轮胎外包出去，那么即使是轮胎的尺寸发生变变了，我们只需要向代理工厂下订单就行了，我们自身是不需要出力的。

### 控制反转式程序开发
基于以上思路，我们把调用汽车的程序示例改造一下，把创建子类的方式，改为注入传递的方式
```java
public class test {  
    public static void main(String[] args) {  
        Tire tire = new Tire(20);  
        Bottom bottom = new Bottom(tire);  
        Framework framework = new Framework(bottom);  
        Car car = new Car(framework);  
        car.run();  
    }  
  
    //汽车对象  
    static class Car {  
        private Framework framework;  
        public Car(Framework framework) {  
            this.framework = framework;  
        }  
        public void run() {  
            framework.init();  
        }  
    }  
  
    //车身类  
    static class Framework {  
        private Bottom bottom;  
        public Framework(Bottom bottom) {  
            this.bottom = bottom;  
        }  
        public void init() {  
            bottom.init();  
        }  
    }  
  
    //底盘类  
    static class Bottom {  
        private Tire tire;  
        public Bottom(Tire tire) {  
            this.tire = tire;  
        }  
        public void init() {  
            tire.init();  
        }  
    }  
  
    //轮胎类  
    static class Tire{  
        private int size = 30;//尺寸  
  
        public Tire(int size){  
            this.size = size;  
        }  
  
        public void init(){  
            System.out.println("轮胎尺寸:"+ size);  
        }  
    }  
}
```
代码经过以上调整，无论底层类如何变化，整个调用链是不用做任何改变的，这样就完成了代码之间的**解耦**，从而实现了更加灵活、通用的程序设计了。
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230514201834.png)

### 对比总结规律
- 在传统的代码中对象创建顺序是：Car -> Framework -> Bottom -> Tire
- 改进之后解耦的代码的对象创建顺序是：Tire -> Bottom -> Framework -> Car
![image.png](https://image-1311137268.cos.ap-chengdu.myqcloud.com/SiYuan/20230514201959.png)
我们发现了一个规:通用程序的实现代码，类的创建顺序是反的，传统代码是Car控制并创建了Framework，Framework 创建并创建了Bottom，依次往下，而**改进之后的控制权发生的反转**.
>不再是上级对象创建并控制下级对象了，而是下级对象把注入将当前对象中，下级的控制权不再由上级类控制了，这样即使下级类发生任何改变，当前类都是不受影响的，这就是典型的控制反转，也就是 IoC的实现思想。


回到我们的主题 Spring，本文刚开始咱们就讲：**Spring 是包含了多个工具方法的 IoC 容器**，这就是对 Spring 最核心的总结。

那如何理解“Spring 是一个 IoC容器”这句话呢？
既然 Spring 是一个 IoC（控制反转）容器，重点还在“容器”二字上，那么它就具备两个最基础的功能：
- 将对象存入到容器；
- 从容器中取出对象。
也就是说**学 Spring 最核心的功能，就是学如何将对象存入到 Spring 中，再从 Spring 中获取对象的过程**。

>**将对象存放到容器中的好处**：将对象存储在 IoC 容器相当于将以后可能用的所有工具制作好都放到仓库中，需要的时候直接取就行了，用完再把它放回到仓库。而 new 对象的方式相当于，每次需要工具了，才现做，用完就扔掉了也不会保存，下次再用的时候还得重新做，这就是 IoC 容器和普通程序开发的区别。

Spring 是一个 IoC 容器，说的是**对象的创建和销毁的权利都交给 Spring 来管理了，它本身又具备了存储对象和获取对象的能力**。


## DI 概念
说到 IoC 不得不提的一个词就是“DI”，DI 是 Dependency Injection 的缩写，翻译成中文是“依赖注入”的意思。

所谓依赖注入，就是由 IoC 容器在运行期间，动态地将某种依赖关系注入到对象之中。所以，依赖注入（DI）和控制反转（IoC）是从不同的角度的描述的同一件事情，就是指通过引入 IoC 容器，利用依赖关系注入的方式，实现对象之间的解耦。

IoC 是“目标”也是一种思想，而目标和思想只是一种指导原则，最终还是要有可行的落地方案，而 DI 就属于具体的实现。

## AOP
**AOP**：Aspect Oriented Programming 的简写，译为“面向切面编程”。AOP 用来封装多个类的公共行为，将那些与业务无关，却为业务模块所共同调用的逻辑封装起来，减少系统的重复代码，降低模块间的耦合度。另外，AOP 还解决一些系统层面上的问题，比如日志、事务、权限等。

# 总结
-   非侵入式：使用 Spring Framework 开发应用程序时，Spring 对应用程序本身的结构影响非常小。对领域模型可以做到零污染；对功能性组件也只需要使用几个简单的注解进行标记，完全不会破坏原有结构，反而能将组件结构进一步简化。这就使得基于 Spring Framework 开发应用程序时结构清晰、简洁优雅。

-   控制反转：IoC——Inversion of Control，翻转资源获取方向。把自己创建资源、向环境索取资源变成环境将资源准备好，我们享受资源注入。

-   面向切面编程：AOP——Aspect Oriented Programming，在不修改源代码的基础上增强代码功能。

-   容器：Spring IoC 是一个容器，因为它包含并且管理组件对象的生命周期。组件享受到了容器化的管理，替程序员屏蔽了组件创建过程中的大量细节，极大的降低了使用门槛，大幅度提高了开发效率。
   
-   组件化：Spring 实现了使用简单的组件配置组合成一个复杂的应用。在 Spring 中可以使用 XML 和 Java 注解组合这些对象。这使得我们可以基于一个个功能明确、边界清晰的组件有条不紊的搭建超大型复杂应用系统。
   
-   一站式：在 IoC 和 AOP 的基础上可以整合各种企业应用的开源框架和优秀的第三方类库。而且 Spring 旗下的项目已经覆盖了广泛领域，很多方面的功能性需求可以在 Spring Framework 的基础上全部使用 Spring 来实现。