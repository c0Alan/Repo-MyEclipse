XmlUtil = {
	
	/**
	 * ���һ���ڵ��µ��ı�
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
	 * ����һ���ڵ���ı�
	 */
	setText: function(xmlNode, value){
		if(Ext.isIE){
			xmlNode.text = value;
		}else{
			xmlNode.textContent = value;
		}
	},
	
	/**
	 * ���ָ�����Ƶ��ӽڵ�
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
	 * ����Զ������ӽڵ���ı�
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
	 * ���xml�ı�
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