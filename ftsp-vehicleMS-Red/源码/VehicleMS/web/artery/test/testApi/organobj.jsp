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
public class Organ {
    /**
     * 加载类型为clazz的所有子node
     * 
     * @param clazz
     *            null：查找所有节点；EntityUser:查找用户节点；EntityDept:查找庭室或庭内小组
     * @param valid
     *            0:全部，1：只包括有效，2：只包括无效
     * @return
     */
    public static List getOrganEntities(Class clazz, int valid);

    /**
     * 返回类型为clazz的所有子node的id，用于&lt;ui:organizationCode&gt;的filter
     * 
     * @param clazz
     *            null：查找所有节点；EntityUser:查找用户节点；EntityDept:查找庭室或庭内小组
     * @param valid
     *            0:全部，1：只包括有效，2：只包括无效
     * @return
     */
    public static List getOrganEntityIds(Class clazz, int valid);

    /**
     * 加载指定单位的用户列表 
     * @param valid 0:全部，1：只包括有效，2：只包括无效
     * @param corpId 单位编号
     * @return 用户列表
     */
    public static List getUsersByCorpId(int valid, String corpId);

    /**
     * 加载指定部门的用户列表
     * @param valid 0:全部，1：只包括有效，2：只包括无效
     * @param deptId 部门编号
     * @return 用户列表
     */
    public static List getUsersByDeptId(int valid, String deptId);

    /**
     * 查找listId中列出的用户对象列表
     * 
     * @param listId
     *            用户编号列表
     * @return
     */
    public static List getEntityUser4Ids(List listId);

    /**
     * 通过用户编号（主键）得到用户对象，由于一个用户能在多个部门下出现，只返回第一个出现的EntityUser
     * 
     * @param sIdentifier
     * @return
     */
    public static EntityUser getUserById(String sId);
    
    /**
     * 根据id（主键），获得用户名
     * @param sId
     * @return
     */
    public static String getUserNameById(String sId);

    /**
     * 通过登录标识得到用户对象，由于一个用户能在多个部门下出现，只返回第一个出现的EntityUser
     * 
     * @param sIdentifier
     * @return
     */
    public static EntityUser getUserByIdentifier(String sIdentifier);

    /**
     * 获取当前登陆的用户对象 注意：此方法只能在http请求上下文环境中调用，否则报错
     * 
     * @return EntityUser
     */
    public static EntityUser getCurrUserInfo();

    /**
     * 验证用户密码是否正确
     * 
     * @param iUserID
     *            用户代码
     * @param sPassword
     *            用户密码
     * @return true: 用户密码匹配正确
     */
    public static boolean checkUserPassword(Integer iUserID, String sPassword);

    /**
     * 根据id得到dept对象
     * 
     * @param iDeptId
     * @return
     */
    public static EntityDept getDeptById(String sDeptId);

    public static String getDeptNameById(String sDeptId);

    /**
     * 根据id得到corp对象
     * 
     * @param iCorp
     * @return
     */
    public static EntityCorp getCorpById(String sCorpId);

    public static String getCorpNameById(String sCorpId);
}
          </pre>
  </body>
</html>