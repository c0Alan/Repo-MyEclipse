<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<html>
  <head>
    <html:base />
    <title>beanshell可用的公共上下文api调用说明</title>
    <script src="<html:rewrite page='/artery/components/textEditor/swfobject.js'/>"></script>
    <script src="<html:rewrite page='/artery/components/textEditor/CodePanel.js'/>"></script>
    <script type="text/javascript">
    Ext.onReady(function(){
        
        var codePanel = new CodePanel({
            language: "java"
        });
        codePanel.setCode(document.getElementById("myCode").innerText.replace(/\r/g,""));
        
        new Ext.Viewport({
            layout:'fit',
            border:false,
            hideBorders :true,
            items:[codePanel]
        });
    });
    </script>
  </head>
  <body>
    <pre style="display: none;" id="myCode">
public class QueryManager {

	static Log logger = LogFactory.getLog(QueryManager.class);

	public static DataSource ds = (DataSource) AppContext.getInstance()
			.getAppContext().getBean("userDataSource");

	/**
	 * 得到连接
	 * 
	 * @return
	 */
	public static Connection getConnection();

	/**
	 * 关闭连接
	 * 
	 * @param conn
	 */
	public static void closeConnection(Connection conn);

	/**
	 * 查询生成结果集
	 * 
	 * @param conn
	 * @param sql
	 * @return
	 * @throws Exception
	 */
	public static ResultSet queryResultSet(Connection conn, String sql) throws Exception;

	/**
	 * 查询生成DataSet对象
	 * 
	 * @param sql
	 * @return
	 * @throws Exception
	 */
	public static DataSet queryDataSet(String sql) throws Exception;
	
	/**
	 * 执行数据源中的所有sql，把结果集放到map中
	 * 
	 * @param sqls
	 * @return
	 * @throws Exception
	 */
	public static Map queryDataSet(Map sqls) throws Exception;
	
	/**
	 * 执行sql，并用指定对象处理结果集
	 * @param sql
	 * @param rscb
	 * @throws SQLException 
	 */
	public static void query(String sql,ResultSetCallback rscb) throws SQLException;
	
	/**
	 * 执行sql，并用指定对象处理结果集
	 * @param sql
	 * @param args 参数集合
	 * @param rscb
	 * @throws SQLException 
	 */
	public static void query(String sql,Object[] args,ResultSetCallback rscb) throws SQLException;
	
	/**
	 * 执行更新
	 * @param sql
	 * @throws SQLException 
	 */
	public static int update(String sql) throws SQLException;
	
	/**
	 * 执行更新
	 * @param sql
	 * @param params 参数列表
	 * @throws SQLException 
	 */
	public static int update(String sql,Object[] params) throws SQLException;
}</pre>
  </body>
</html>
