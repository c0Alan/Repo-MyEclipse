XmlUtil = {
	
	/**
	 * 获得一个节点下的文本
	 * @param xmlNode
	 * @return
	 */
	getText : function (xmlNode) {
		if(Ext.isIE){
			return xmlNode.text;
		}else{
			return xmlNode.textContent.trim();
			/*var text = "";
			for (var i = 0; i < xmlNode.childNodes.length; i++) {
				var cn = xmlNode.childNodes[i];
	       		if (cn.hasChildNodes()) {
					text += XmlUtil.getText(cn);
				} else {
					text += cn.nodeValue;
				}
	    	}
	    	return text.trim();*/
		}
	},
	
	/**
	 * 设置一个节点的文本
	 */
	setText: function(xmlNode, value){
		if(Ext.isIE){
			xmlNode.text = value;
		}else{
			xmlNode.textContent = value;
		}
	},
	
	/**
	 * 获得指定名称的子节点
	 * @param xmlNode
	 * @param childName
	 */
	getChild : function(xmlNode, childName){
		var cl = xmlNode.getElementsByTagName(childName);
		if(cl && cl.length>0){
			return cl[0];
		}else{
			return null;
		}
	},
	
	/**
	 * 获得自定名称子节点的文本
	 * @param xmlNode
	 * @param childName
	 * @return
	 */
	getChildText: function(xmlNode, childName){
		var cn = XmlUtil.getChild(xmlNode, childName);
		if(cn){
			return XmlUtil.getText(xmlNode);
		}else{
			return "";
		}
	},
	
	/**
	 * 获得xml文本
	 * @param xmlNode
	 * @return
	 */
	getXml: function(xmlNode){
		if(Ext.isIE){
			return xmlNode.xml;
		}else{
			var oSerializer = new XMLSerializer();
    		return oSerializer.serializeToString(xmlNode);
		}
	}
};