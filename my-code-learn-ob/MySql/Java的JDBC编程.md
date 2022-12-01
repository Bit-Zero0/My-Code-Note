数据库驱动包：不同的数据库，对应不同的编程语言提供了不同的数据库驱动包，如：MySQL提供了Java的驱动包mysql-connector-java，需要基于Java操作MySQL即需要该驱动包。同样的，要基于Java操作Oracle数据库则需要Oracle的数据库驱动包ojdbc。

#  Java的数据库编程：JDBC
JDBC，即Java Database Connectivity，java数据库连接。是一种用于执行SQL语句的Java API，它是 Java中的数据库连接规范。这个API由 `java.sql.*`,`javax.sql.*` 包中的一些类和接口组成，它为Java 开发人员操作数据库提供了一个标准的API，可以为多种关系数据库提供统一访问。

##  JDBC本质
-   官方（sun公司）定义的一套操作所有关系型数据库的规则，即接口
    
-   各个数据库厂商去实现这套接口，提供数据库驱动jar包
    
-   我们可以使用这套接口（JDBC）编程，真正执行的代码是驱动jar包中的实现类
    

## 1.3 JDBC好处
-   各数据库厂商使用相同的接口，Java代码不需要针对不同数据库分别开发
    
-   可随时替换底层数据库，访问数据库的Java代码基本不变 (C++er 已经馋哭了)
    

以后编写操作数据库的代码只需要面向JDBC（接口），操作哪儿个关系型数据库就需要导入该数据库的驱动包，如需要操作MySQL数据库，就需要再项目中导入MySQL数据库的驱动包。如下图就是MySQL驱动包
![[Pasted image 20221130085357.png]]




## JDBC快速入门
### 编写代码步骤
1. 创建数据库连接Connection
2. 创建操作命令Statement
3. 使用操作命令来执行SQL
4. 处理结果集ResultSet
5. 释放资源



### 具体代码
主要使用 DataSource 连接数据库。
```java
import com.mysql.cj.jdbc.MysqlDataSource;  
  
import javax.sql.DataSource;  
import java.sql.Connection;  
import java.sql.PreparedStatement;  
import java.sql.SQLException;  
import java.util.Scanner;  
  
public class TestJDBC {  
    public static void main(String[] args) throws SQLException {  
        Scanner scanner = new Scanner(System.in);  
  
        // 1. 创建好数据源  
        DataSource dataSource = new MysqlDataSource();  
        // 设置数据库所在的地址  
        ((MysqlDataSource) dataSource).setURL("jdbc:mysql://127.0.0.1:3306/mydb?characterEncoding=utf8&useSSL=false");  
        // 设置登录数据库的用户名  
        ((MysqlDataSource) dataSource).setUser("root");  
        // 这个是设置登录数据库的密码  
        ((MysqlDataSource) dataSource).setPassword("back7671773");  
  
        // 2. 让代码和数据库服务器建立连接  
        Connection connection = dataSource.getConnection();  
  
        // 2.5 让用户通过控制台输入一下待插入的数据  
        System.out.println("请输入学号: ");  
        int id = scanner.nextInt();  
        System.out.println("请输入姓名: ");  
        String name = scanner.next();  
  
        // 3. 操作数据库. 以插入数据为例.  
        //    关键所在就是构造一个 SQL 语句~  
        //    在 JDBC 中构造的 SQL, 不必带上 ;        
        //    ; 只是在命令行中用来区分不同的语句. 现在是直接在代码中操作  
        String sql = "insert into student values(? ,?)";  
        // 此处光是一个 String 类型的 sql 还不行, 需要把这个 String 包装成一个 "语句对象"  
        PreparedStatement statement = connection.prepareStatement(sql);  
  
        // 进行替换操作  
        statement.setInt(1 , id);  
        statement.setString(2, name);  
        System.out.println("statement:"+ statement);  
  
        // 4. 执行 SQL   
        //    SQL 里面如果是 insert, update, delete, 都使用 executeUpdate 方法.  
        //    SQL 里面如果是 select, 则使用 executeQuery 方法.  
        //    返回值就表示这个操作, 影响到了 几行. 就相当于在控制台里输入 sql 之后, 得到的数字  
        int ret = statement.executeUpdate();  
        System.out.println(ret);  
  
        // 5. 此时 SQL 已经执行完毕. 然后还需要释放资源.  
        statement.close();  
        connection.close();  
    }  
}
```


# JDBC API 详解
## DriverManager

DriverManager（驱动管理类）作用：
-   注册驱动
   ![[Pasted image 20221130095555.png]]
    
    registerDriver方法是用于注册驱动的，但是我们之前做的入门案例并不是这样写的。而是如下实现
```java
    Class.forName("com.mysql.jdbc.Driver");    
```
我们查询MySQL提供的Driver类，看它是如何实现的，源码如下：
![[Pasted image 20221130095653.png]]
在该类中的静态代码块中已经执行了 `DriverManager` 对象的 `registerDriver()` 方法进行驱动的注册了，那么我们只需要加载 `Driver` 类，该静态代码块就会执行。而 `Class.forName("com.mysql.jdbc.Driver");` 就可以加载 `Driver` 类。

> ==提示：== 
> -   MySQL 5之后的驱动包，可以省略注册驱动的步骤
> -   自动加载jar包中META-INF/services/java.sql.Driver文件中的驱动类
    
-   获取数据库连接
    ![image-20210725171355278](file://D:\%E8%AF%AD%E8%A8%80%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0\java%E8%AF%AD%E8%A8%80%E7%AC%94%E8%AE%B0\%E9%BB%91%E9%A9%ACJavaWeb\day03-JDBC\ppt\assets\image-20210725171355278.png?lastModify=1669773249)
    
    参数说明：
    -   **url** ： 连接路径
        > 语法：`jdbc:mysql://ip地址(域名):端口号/数据库名称?参数键值对1&参数键值对2…`
        > 示例：`jdbc:mysql://127.0.0.1:3306/db1`
        > 
        > ==细节：==
        > -   如果连接的是本机mysql服务器，并且mysql服务默认端口是3306，则url可以简写为：`jdbc:mysql:///数据库名称?参数键值对`
        > -   配置 `useSSL=false` 参数，禁用安全连接方式，解决警告提示
        
    -   **user** ：用户名
        
    -   **poassword** ：密码
        

##  Connection
Connection（数据库连接对象）作用：
-   获取执行 SQL 的对象
-   管理事务

Connection接口实现类由数据库提供，**获取Connection对象通常有两种方式**：
- 一种是通过`DriverManager`（驱动管理类）的静态方法获取：
```java
// 加载JDBC驱动程序
Class.forName("com.mysql.jdbc.Driver"); 
// 创建数据库连接
Connection connection = DriverManager.getConnection(url);
```

- 一种是通过`DataSource`（数据源）对象获取。**实际应用中会使用DataSource对象**。
```java
DataSource ds = new MysqlDataSource();
((MysqlDataSource) ds).setUrl("jdbc:mysql://localhost:3306/test"); 
((MysqlDataSource) ds).setUser("root");
((MysqlDataSource) ds).setPassword("root"); 
Connection connection = ds.getConnection();
```

以上两种方式的区别是：
1. **DriverManager**类来获取的Connection连接，是无法重复利用的，每次使用完以后释放资源时，通过`connection.close()`都是关闭物理连接。
2. **DataSource**提供连接池的支持。连接池在初始化时将创建一定数量的数据库连接，这些连接是可以复用的，每次使用完数据库连接，释放资源调用`connection.close()`都是将Conncetion连接对象回收。

### 获取执行对象
-   普通执行SQL对象
```java
Statement createStatement()
```
入门案例中就是通过该方法获取的执行对象。
    
-   预编译SQL的执行SQL对象：防止SQL注入
```java
PreparedStatement  prepareStatement(sql)
```
通过这种方式获取的 `PreparedStatement` SQL语句执行对象是我们一会重点要进行讲解的，它可以防止SQL注入。
    
-   执行存储过程的对象
```java
CallableStatement prepareCall(sql)

```    
通过这种方式获取的 `CallableStatement` 执行对象是用来执行存储过程的，而存储过程在MySQL中不常用，所以这个我们将不进行讲解。
    

### 事务管理
先回顾一下MySQL事务管理的操作：
-   开启事务 ： BEGIN; 或者 START TRANSACTION;
-   提交事务 ： COMMIT;
-   回滚事务 ： ROLLBACK;

> MySQL默认是自动提交事务

接下来学习JDBC事务管理的方法。

Connection几口中定义了3个对应的方法：
-   开启事务
    ![[Pasted image 20221130100148.png]]
    参与autoCommit 表示是否自动提交事务，true表示自动提交事务，false表示手动提交事务。而开启事务需要将该参数设为为false。
    
-   提交事务
    ![[Pasted image 20221130100242.png]]
     
-   回滚事务
![[Pasted image 20221130100224.png]]
    

#### 具体代码实现如下：
```java
/**
 * JDBC API 详解：Connection
 */
public class JDBCDemo3_Connection {

    public static void main(String[] args) throws Exception {
        //1. 注册驱动
        //Class.forName("com.mysql.jdbc.Driver");
        //2. 获取连接：如果连接的是本机mysql并且端口是默认的 3306 可以简化书写
        String url = "jdbc:mysql:///db1?useSSL=false";
        String username = "root";
        String password = "1234";
        Connection conn = DriverManager.getConnection(url, username, password);
        //3. 定义sql
        String sql1 = "update account set money = 3000 where id = 1";
        String sql2 = "update account set money = 3000 where id = 2";
        //4. 获取执行sql的对象 Statement
        Statement stmt = conn.createStatement();

        try {
            // ============开启事务==========
            conn.setAutoCommit(false);
            //5. 执行sql
            int count1 = stmt.executeUpdate(sql1);//受影响的行数
            //6. 处理结果
            System.out.println(count1);
            int i = 3/0;
            //5. 执行sql
            int count2 = stmt.executeUpdate(sql2);//受影响的行数
            //6. 处理结果
            System.out.println(count2);

            // ============提交事务==========
            //程序运行到此处，说明没有出现任何问题，则需求提交事务
            conn.commit();
        } catch (Exception e) {
            // ============回滚事务==========
            //程序在出现异常时会执行到这个地方，此时就需要回滚事务
            conn.rollback();
            e.printStackTrace();
        }

        //7. 释放资源
        stmt.close();
        conn.close();
    }
}
```

## Statement
![[Pasted image 20221130102328.png]]
[[Java的JDBC编程#事务管理]]

### 概述
Statement对象的作用就是用来执行SQL语句。而针对不同类型的SQL语句使用的方法也不一样。

-   执行DDL、DML语句
    ![[Pasted image 20221130100547.png]]
    
-   执行DQL语句
    ![[Pasted image 20221130100559.png]]
    该方法涉及到了 `ResultSet` 对象，而这个对象我们还没有学习，一会再重点讲解。
    

### 代码实现
-   执行DML语句
```java
@Test
public void testDML() throws  Exception {
    //1. 注册驱动
    //Class.forName("com.mysql.jdbc.Driver");
    //2. 获取连接：如果连接的是本机mysql并且端口是默认的 3306 可以简化书写
    String url = "jdbc:mysql:///db1?useSSL=false";
    String username = "root";
    String password = "1234";
    Connection conn = DriverManager.getConnection(url, username, password);
    //3. 定义sql
    String sql = "update account set money = 3000 where id = 1";
    //4. 获取执行sql的对象 Statement
    Statement stmt = conn.createStatement();
    //5. 执行sql
    int count = stmt.executeUpdate(sql);//执行完DML语句，受影响的行数
    //6. 处理结果
    //System.out.println(count);
    if(count > 0){
        System.out.println("修改成功~");
    }else{
        System.out.println("修改失败~");
    }
    //7. 释放资源
    stmt.close();
    conn.close();
}
```

- 执行DDL语句
```java
/**
  * 执行DDL语句
  * @throws Exception
  */
@Test
public void testDDL() throws  Exception {
    //1. 注册驱动
    //Class.forName("com.mysql.jdbc.Driver");
    //2. 获取连接：如果连接的是本机mysql并且端口是默认的 3306 可以简化书写
    String url = "jdbc:mysql:///db1?useSSL=false";
    String username = "root";
    String password = "1234";
    Connection conn = DriverManager.getConnection(url, username, password);
    //3. 定义sql
    String sql = "drop database db2";
    //4. 获取执行sql的对象 Statement
    Statement stmt = conn.createStatement();
    //5. 执行sql
    int count = stmt.executeUpdate(sql);//执行完DDL语句，可能是0
    //6. 处理结果
    System.out.println(count);

    //7. 释放资源
    stmt.close();
    conn.close();
}
```
-   > 注意：
    > 
    > -   以后开发很少使用java代码操作DDL语句
    >     
    

## ResultSet

### 概述
ResultSet（结果集对象）作用：
-   ==封装了SQL查询语句的结果。==
    
而执行了DQL语句后就会返回该对象，对应执行DQL语句的方法如下：
```java
ResultSet  executeQuery(sql)：执行DQL 语句，返回 ResultSet 对象
```

那么我们就需要从 `ResultSet` 对象中获取我们想要的数据。`ResultSet` 对象提供了操作查询结果数据的方法，如下：

> `boolean next()`
> -   将光标从当前位置向前移动一行
> -   判断当前行是否为有效行
>     
> 方法返回值说明：
> -   true ： 有效航，当前行有数据
> -   false ： 无效行，当前行没有数据


> `xxx getXxx(参数)`：获取数据
> -   xxx : 数据类型；如： int getInt(参数) ；String getString(参数)
> -   参数
>     -   int类型的参数：列的编号，从1开始
>     -   String类型的参数： 列的名称

如下图为执行SQL语句后的结果
![[Pasted image 20221130101004.png]]
一开始光标指定于第一行前，如图所示红色箭头指向于表头行。当我们调用了 `next()` 方法后，光标就下移到第一行数据，并且方法返回true，此时就可以通过 `getInt("id")` 获取当前行id字段的值，也可以通过 `getString("name")` 获取当前行name字段的值。如果想获取下一行的数据，继续调用 `next()` 方法，以此类推。

### 代码实现
```java
/**
  * 执行DQL
  * @throws Exception
  */
@Test
public void testResultSet() throws  Exception {
    //1. 注册驱动
    //Class.forName("com.mysql.jdbc.Driver");
    //2. 获取连接：如果连接的是本机mysql并且端口是默认的 3306 可以简化书写
    String url = "jdbc:mysql:///db1?useSSL=false";
    String username = "root";
    String password = "1234";
    Connection conn = DriverManager.getConnection(url, username, password);
    //3. 定义sql
    String sql = "select * from account";
    //4. 获取statement对象
    Statement stmt = conn.createStatement();
    //5. 执行sql
    ResultSet rs = stmt.executeQuery(sql);
    //6. 处理结果， 遍历rs中的所有数据
    /* // 6.1 光标向下移动一行，并且判断当前行是否有数据
        while (rs.next()){
            //6.2 获取数据  getXxx()
            int id = rs.getInt(1);
            String name = rs.getString(2);
            double money = rs.getDouble(3);

            System.out.println(id);
            System.out.println(name);
            System.out.println(money);

            System.out.println("--------------");

        }*/
    // 6.1 光标向下移动一行，并且判断当前行是否有数据
    while (rs.next()){
        //6.2 获取数据  getXxx()
        int id = rs.getInt("id");
        String name = rs.getString("name");
        double money = rs.getDouble("money");

        System.out.println(id);
        System.out.println(name);
        System.out.println(money);

        System.out.println("--------------");
    }

    //7. 释放资源
    rs.close();
    stmt.close();
    conn.close();
}
```

### 案例

-   需求：查询account账户表数据，封装为Account对象中，并且存储到ArrayList集合中
- ![[Pasted image 20221130101125.png]]
```java
/**
  * 查询account账户表数据，封装为Account对象中，并且存储到ArrayList集合中
  * 1. 定义实体类Account
  * 2. 查询数据，封装到Account对象中
  * 3. 将Account对象存入ArrayList集合中
  */
@Test
public void testResultSet2() throws  Exception {
    //1. 注册驱动
    //Class.forName("com.mysql.jdbc.Driver");
    //2. 获取连接：如果连接的是本机mysql并且端口是默认的 3306 可以简化书写
    String url = "jdbc:mysql:///db1?useSSL=false";
    String username = "root";
    String password = "1234";
    Connection conn = DriverManager.getConnection(url, username, password);

    //3. 定义sql
    String sql = "select * from account";

    //4. 获取statement对象
    Statement stmt = conn.createStatement();

    //5. 执行sql
    ResultSet rs = stmt.executeQuery(sql);

    // 创建集合
    List<Account> list = new ArrayList<>();
   
    // 6.1 光标向下移动一行，并且判断当前行是否有数据
    while (rs.next()){
        Account account = new Account();

        //6.2 获取数据  getXxx()
        int id = rs.getInt("id");
        String name = rs.getString("name");
        double money = rs.getDouble("money");

        //赋值
        account.setId(id);
        account.setName(name);
        account.setMoney(money);

        // 存入集合
        list.add(account);
    }

    System.out.println(list);

    //7. 释放资源
    rs.close();
    stmt.close();
    conn.close();
}
```


## PreparedStatement
> PreparedStatement作用：
> -   预编译SQL语句并执行：预防SQL注入问题

### SQL 注入问题
https://www.jianshu.com/p/078df7a35671


### PreparedStatement概述
-   获取 PreparedStatement 对象
```java
// SQL语句中的参数值，使用？占位符替代  
String sql = "select * from user where username = ? and password = ?";  
// 通过Connection对象获取，并传入对应的sql语句  
PreparedStatement pstmt = conn.prepareStatement(sql);
```  
    
    
-   设置参数值
    上面的sql语句中参数使用 ? 进行占位，在之前之前肯定要设置这些 ? 的值。
    > PreparedStatement对象：setXxx(参数1，参数2)：给 `?` 赋值
    > -   Xxx：数据类型 ； 如 setInt (参数1，参数2)
    > -   参数：
    >     -   参数1： `?`的位置编号，**从==1== 开始**
    >     -   参数2： `?`的值
    
-   执行SQL语句
    > `executeUpdate()`; 方法返回值是一个整数，指示受影响的行数，通常用于update、insert、delete 语句
    > `executeQuery()`; 方法执行后返回单个结果集的，通常用于select语句
    > 
    > ==注意：==
    > -   调用这两个方法时不需要传递SQL语句，因为获取SQL语句执行对象时已经对SQL语句进行预编译了。


# 注意事项
## 资源回收
资源回收时，是类似于递归式的回收资源，先创建的后回收，后创建的先回收。

>Tip:  就像我们需要去冰箱取东西
>1. 打开冰箱门
>2. 拉开小储物柜
>3. 取东西
>4. 关闭小储物柜
>5. 关闭冰箱门


## 不要对sql语句进行插入
看以下代码
```java
String sql = "insert into student values(" + id + ", '张三')";
```
这里的 `id` 就是我们要进行插入的值。

>通过字符串拼接这个操作来构造sql,也是可行的.但是并不科学!!!
>1. 这么写非常麻烦,容易写错.
>2. 这么写也容易引起"sql注入攻击".

推荐使用 [[Java的JDBC编程#PreparedStatement概述|PreparedStatement]] 的 **setXXX系列方法**进行替换。
```java
String sql = "insert into student values(? , ?)";
```


# 具体代码
## 查询
查询的步骤稍微麻烦一些，需要使用到[[Java的JDBC编程#ResultSet|ResultSet]]
```java
import com.mysql.cj.jdbc.MysqlDataSource;  
  
import javax.sql.DataSource;  
import java.sql.Connection;  
import java.sql.PreparedStatement;  
import java.sql.ResultSet;  
import java.sql.SQLException;  
  
public class TestJDBCSelect {  
    public static void main(String[] args) throws SQLException {  
        DataSource dataSource= new MysqlDataSource();  
  
        ((MysqlDataSource) dataSource).setURL("jdbc:mysql://127.0.0.1:3306/mydb?characterEncoding=utf8&useSSL=false");  
        ((MysqlDataSource) dataSource).setUser("root");  
        ((MysqlDataSource) dataSource).setPassword("back7671773");  
  
        Connection connection = dataSource.getConnection();  
  
        String sql = "select * from student ";  
        PreparedStatement statement = connection.prepareStatement(sql);  
        ResultSet resultSet =  statement.executeQuery();  
  
  
        while(resultSet.next())  
        {  
            int id = resultSet.getInt("id");  
            String name = resultSet.getString("name");  
  
            System.out.println("id : "+ id);  
            System.out.println("name : "+ name);  
        }  
  
        resultSet.close();  
        statement.close();  
        connection.close();  
    }  
}
```

## 更新与删除
**更新**
```java
import com.mysql.cj.jdbc.MysqlDataSource;  
  
import javax.sql.DataSource;  
import java.sql.Connection;  
import java.sql.PreparedStatement;  
import java.sql.SQLException;  
import java.util.Scanner;  
  
public class TestJDBCUpdate {  
    public static void main(String[] args) throws SQLException {  
        DataSource dataSource = new MysqlDataSource();  
        ((MysqlDataSource)dataSource).setURL("jdbc:mysql:///mydb?characterEncoding=utf8&useSSL=false");  
        ((MysqlDataSource)dataSource).setUser("root");  
        ((MysqlDataSource)dataSource).setPassword("back7671773");  
  
        Connection connection =dataSource.getConnection();  
  
        Scanner scanner = new Scanner(System.in);  
        System.out.println("请输入要修改的学生id: ");  
        int id = scanner.nextInt();  
        System.out.println("请输入要修改的学生姓名: ");  
        String name = scanner.next();  
  
        String sql = "update student set name = ? where id = ?";  
        PreparedStatement statement = connection.prepareStatement(sql);  
        statement.setInt(2 , id);  
        statement.setString(1, name);  
  
        System.out.println("statement: " + statement);  
  
        int ret = statement.executeUpdate();  
        System.out.println("ret = " + ret);  
  
        statement.close();  
        connection.close();  
    }  
}
```

**删除**
```java
import com.mysql.cj.jdbc.MysqlDataSource;  
  
import javax.sql.DataSource;  
import java.sql.Connection;  
import java.sql.PreparedStatement;  
import java.sql.SQLException;  
import java.util.Scanner;  
  
public class TestJDBCDelete {  
    public static void main(String[] args) throws SQLException {  
        DataSource dataSource = new MysqlDataSource();  
        ((MysqlDataSource) dataSource).setURL("jdbc:mysql:///mydb?characterEncoding=utf8&useSSL=false");  
        ((MysqlDataSource) dataSource).setUser("root");  
        ((MysqlDataSource) dataSource).setPassword("back7671773");  
  
        Connection connection = dataSource.getConnection();  
  
        Scanner scanner = new Scanner(System.in);  
        System.out.printf("请输入一个要删除的 id: ");  
        int id = scanner.nextInt();  
  
        String sql = "delete from student where id = ?";  
        PreparedStatement statement = connection.prepareStatement(sql);  
  
        statement.setInt(1, id);  
  
        int ret = statement.executeUpdate();  
        System.out.println("ret:" + ret);  
  
        statement.close();  
        connection.close();  
    }  
}
```





















