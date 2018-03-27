<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.thunisoft.artery.parse.eform.EformUtil" %>
<%@ include file="/artery/pub/jsp/commhead.jsp"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
  <link rel="stylesheet" type="text/css" href="<c:url value='/artery/writ/parse/writparse.css'/>" />  
  <link rel="stylesheet" type="text/css" href="<c:url value='/artery/form/parse/css/form-parse.css'/>" />
  <%=EformUtil.getPubCSS() %>
  <script src="<html:rewrite page='/artery/arteryPlugin/pub/Artery.js'/>"></script>
  <script src="<html:rewrite page='/artery/arteryPlugin/pub/ScriptRunner.js'/>"></script>
  <script src="<html:rewrite page='/artery/arteryPlugin/pub/parse-pub.js'/>"></script>
  <script src="<html:rewrite page='/artery/arteryPlugin/writ/writTplContainer/NTKOPanel.js'/>"></script>
  <script type="text/javascript">
  var ntko;
  var ntkopnl;
  var treepnl;
  
  //参数列表，包含隐藏参数，公共参数
  var writhis = {};
  writhis.writtplid = '<c:out value="${writtplid}"/>';
  writhis.writid='<c:out value="${writid}"/>';
  writhis.writname='<c:out value="${writname}"/>';
  writhis.lasthisid='<c:out value="${lasthisid}"/>';
  writhis.logtreedata='<c:out value="${logtreedata}" escapeXml="false"/>';
  

  // 树上节点单击事件函数
  function switchButton(node){
    openHis(node.attributes.id);
  }  
  
  //页面初始化
  Ext.onReady(function(){
	Ext.QuickTips.init();
  
    treepnl = new Ext.tree.TreePanel({
      region:'west',
      animate: false,
      width:220,
      split:true,
      minSize:175,
      maxSize:500,
      title:'文书历史版本'+(writhis.writname?"【"+writhis.writname+"】":""),
      header:true,
      border:true,
      containerScroll: true,
      autoScroll:true,
      rootVisible:false,
      lines:false
    });
    
    // 单击事件
    treepnl.on("click",switchButton);
    var rootNode=treepnl.setRootNode(new Ext.tree.TreeNode({
      text : "root",
      type : "root",
      isLeaf : false,
      iconCls : "root"
    }));
    
    ntkopnl = new Artery.plugin.NTKOPanel({
        id:'ntkoeditor',
        region:'center',
        xtype:'apNTKOpanel',
        Caption:"",
        BorderStyle:0,
        Menubar:false,
        IsStrictNoCopy:false,
        ToolBars:false,
        Statusbar:false,
        FilePrint:true,
        FileNew:true,
        FileOpen:true,
        FileSave:false,
        FileSaveAs:true,
        FileClose:false,
        FileProperties:true,
        FilePageSetup:true,
        FilePrintPreview:true,
        anchor:"100% 100%",
        border:true
    });
    
    mainPanel = new Ext.Panel({
        layout:'border',
        items:[{
            region:'center',
            border:false,
            margins:'4 4 4 4',
            layout: 'border',
            items:[treepnl,ntkopnl]
        }],
        tbar : [{
            cls : 'x-btn-text-icon save',
            text : '保存到本地',
            tooltip : '保存到本地',
            handler : function(item) {ntkopnl.saveAs();}
        },{
            cls : 'x-btn-text-icon preview',
            text : '打印预览',
            tooltip : '打印预览',
            handler : function(item) {ntkopnl.preview();}
        },{
            cls : 'x-btn-text-icon printsetup',
            text : "打印设置",
            tooltip : "打印设置",
            handler : function(item){ntkopnl.printSetup();}
        },{
            cls : 'x-btn-text-icon print',
            text : "打印",
            tooltip : "打印",
            handler : function(item){ntkopnl.print();}
        }]
    });
    
	new Ext.Viewport({
		layout:'fit',
		border:false,
		hideBorders :true,
		items:[mainPanel]
	});

    initDocument();
  });

  function initDocument(){
    ntko = ntkopnl.ntko;
    
    if(!writhis.logtreedata){
      mainPanel.getTopToolbar().add('->','<font color="#ff8000"><b>本文书无任何历史信息</b></font>');
      openHis();
      return;
    }
    var treedata = Ext.decode(writhis.logtreedata);
    for(var i=0;i<treedata.logList.length;i++){
      var node = treedata.logList[i];
      var author = node.author;
      var logid = node.logid;
      var updatetime = node.updatetime;
      var treenode = new Ext.tree.TreeNode({
        id:logid,
        leaf:true,
        text:author+"["+updatetime+"]"
      });
      treepnl.root.appendChild(treenode);
    }
    if(treepnl.root && treepnl.root.firstChild)
      treepnl.fireEvent("click",treepnl.root.firstChild);
    else 
      openHis();
  }
  
  function openHis(hisid){
    if(hisid){
      var url = sys.getContextPath() + "/artery/writparse.do?action=loadDocHis&id="+hisid;
      url += "&writtplid=" + writhis.writtplid;
      ntkopnl.loadDoc(url);
    }
  }
</script>
</head>
<body>
</body>
</html>