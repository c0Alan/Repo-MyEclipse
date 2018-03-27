// **********************************************//
// _loopAreaTable 客户端脚本
// 
// @author Artery
// @date 2011-10-10
// @id cc334ad01ee8fb53c374b5430b05f82c
// **********************************************//

/**
 * 客户端(blankPanel0e613)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {item(imageArea7af3b).id}
 */
function blankPanel0e613_onMouseOverClient(rc, imageId) {
  if (!this.selected) 
  {
    this.el.applyStyles('background-color:#E3EDFB;');
    Artery.get(imageId).show();
  }
}


/**
 * 客户端(blankPanel0e613)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {item(imageArea7af3b).id}
 */
function blankPanel0e613_onMouseOutClient(rc, imageId) {
  if (!this.selected) 
  {
    this.el.applyStyles('background-color:#fff;');
    if (Artery.get(imageId).getValue() == 1) 
    {
      Artery.get(imageId).hide();
    }
  }
}


/**
 * 客户端(blankPanel0e613)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {item(imageArea7af3b).id}
 */
function blankPanel0e613_onSelectClient(rc, imageId) {
  this.el.applyStyles('background-color:#A3ECEC;');
  Artery.get(imageId).show();
}


/**
 * 客户端(blankPanel0e613)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {item(imageArea7af3b).id}
 */
function blankPanel0e613_onDeselectClient(rc, imageId) {
  this.el.applyStyles('background-color:#fff;');
  if (Artery.get(imageId).getValue() == 1) 
  {
    Artery.get(imageId).hide();
  }
}


/**
 * 客户端(imageArea7af3b)
 * 
 * @param  rc 系统提供的AJAX调用对象
 * @param  {item(imageArea7af3b).id}
 * @param  {item(blankPanel75d97).id}
 * @param  {rs1.C_ID}
 */
function imageArea7af3b_onClickClient(rc, imgId, infoId, bookId) {
  var imgArea = Artery.get(imgId)  
  var infoArea = Artery.get(infoId)  
  if (imgArea.getValue() == 1) 
  {
    imgArea.changeImage('/artery/arteryImage/arrow/up.gif');
    imgArea.setValue(2);
    Artery.parseItem({params: {itemid: 'formArea50f57', bookId: bookId}, callback: function(result) {
  infoArea.removeAll();
  infoArea.addItem(result);
  infoArea.show();
}});
  } else {
    imgArea.changeImage('/artery/arteryImage/arrow/down.gif');
    imgArea.setValue(1);
    infoArea.hide();
  }
}


/**
 * 分页查询脚本(pagingbar196360)
 * 
 * @param  params 分页传递的参数
 */
function pagingbar196360_onSearch(params) {
  params.itemid = 'blankPanel8ec96';
  Artery.get('blankPanelad267').el.mask(Artery.LODDING);
  Artery.parseItem({params: params, callback: function(result) {
  Artery.get('blankPanelad267').removeAll();
  Artery.get('blankPanelad267').addItem(result);
  Artery.get('blankPanelad267').el.unmask();
}});
}
