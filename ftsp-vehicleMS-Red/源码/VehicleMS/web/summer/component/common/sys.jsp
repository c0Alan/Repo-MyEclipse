<script language="javascript">
Sys.DEFAULT_PLUGIN_PATH = "/summer/component";

function Sys() {
    this._pluginPath = Sys.DEFAULT_PLUGIN_PATH;
}
Sys.prototype.getContextPath = function(){
    return  "<%=request.getContextPath()%>";
};
Sys.prototype.setPluginPath = function(path) {
    this._pluginPath = path;
};
Sys.prototype.getPluginPath = function() {
    return this.getContextPath() + this._pluginPath;
};

sys = new Sys();
</script>
<script type="text/javascript" language='javascript'
  src="<%=request.getContextPath()%>/summer/component/common/util.js"></script>
<script type="text/javascript" language='javascript'
  src="<%=request.getContextPath()%>/summer/component/common/commonctrls.js"></script>
<script type="text/javascript" language='javascript'
  src="<%=request.getContextPath()%>/summer/component/ajax/xmlhttp.js"></script>
