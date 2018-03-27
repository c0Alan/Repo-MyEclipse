﻿﻿/**
 * Artery flashUpload component
 * 
 * @author leo（wangzhuo）
 * @date 4/24/2010
 * 
 * @class Artery.plugin.flashUpload
 * @extends Ext.Component
 */
Artery.plugin.flashUpload = Ext
		.extend(
				Ext.form.Field,
				{
					id : null,
					swfu : null,
					settings : null,
					button_placeholder_id : null,
					formId : null,// 控件所在表单模板的id
					Other_form_ID : null,// 同时提交其他表单区域的数据，formArea的id

					// 文件过滤
					file_types : "*.*", // 可上传的文件类型
					file_types_description : "所有文件",// 可上传的文件类型的别名
					file_size_limit : 20,// 文件大小上限
					total_file_size_limit : 100,// 总文件大小上限
					file_queue_limit : 0,// 最大允许在待传队列中的文件数量

					// 控件样式
					containerWidth : "100%",
					containerHeight : "100%",

					// 选择文件按钮样式
					button_image_url : "chooseButton.png",// 按钮背景图片
					button_width : "62",// 按钮宽度
					button_height : "22",// 按钮高度
					button_text : null,// 按钮文字
					button_text_style : null, // 按钮样式
					button_text_left_padding : 0,// 按钮文字垂直偏移量
					button_text_top_padding : 0,// 按钮文字水平偏移量
					buttonDisabled : false,// 按钮禁用
					inputDisabled : false,// input禁用
					handCursor : false,// 是否使用手型鼠标样式
					singleFile : true,// 是否单文件控件
					showStatus : false,// 是否显示文件状态
					showBar : false,// 是否显示文件进度
					sessionid : null,// 后台传递的sessionid
					deleteFile : "",// 要删除的文件组的value字符串，逗号分隔

					submitName : null,// 要删除的文件组的value字符串，逗号分隔

					value : null,// 控件的值

					initValue : function(){
						if(this.value){
							this.setValue(this.value);
						}else if(!Ext.isEmpty(this.el.dom.value) && this.el.dom.value != this.emptyText){
							this.setValue(this.el.dom.value);
						}
						this.originalValue = this.getValue();
						//modify 上一次的值，调用表单的submit方法改变
						this.previousValue = this.originalValue;
						this.sessionid = this.GetCookie("JSESSIONID")||this.sessionid;
					},
					// //////////////////////////////////////////////////////////////////
					// 事件处理（按时间顺序触发）
					// //////////////////////////////////////////////////////////////////
					// 加载swf完成事件(执行顺序1)
					swfupload_loaded_function : function swfupload_loaded_function() {
						this.totalFileSize = 0;
					},
					// 对话框打开事件(执行顺序2)
					file_dialog_start_function : function file_dialog_start_function() {

					},
					// 文件加入队列事件(执行顺序2.5)
					file_queued_function : function file_queued_function(file) {
						this.customSettings.validate = false;

						// 处理文件总大小超限的情况
						this.totalFileSize += file.size;

						if (this.totalFileSize > this.customSettings.component.total_file_size_limit) {
							var progress = new FileProgress(file,
									this.customSettings.progressTarget);

							progress.setStatus("文件总大小超限");
							if (this.customSettings.component.showErrorTime <= 0) {
								progress.toggleCancel(true, this);
								progress.setError();
							} else {
								progress
										.setError(this.customSettings.component.showErrorTime);
								var object = this;
								setTimeout(function(){progress.toggleCancel(false,object);},this.customSettings.component.showErrorTime);
							}
							return;
						}

						// 如果单文件
						if (this.settings.button_action == SWFUpload.BUTTON_ACTION.SELECT_FILE) {
							// 如果已有文件删除已存在的文件
							if (this.customSettings.component.currentFile) {
								var progress = new FileProgress(
										this.customSettings.component.currentFile,
										this.customSettings.progressTarget);
								progress
										.setCancelled(this.customSettings.component.showCancelTime);
								progress.setStatus("已取消");
								this.cancelUpload(this.customSettings.component.currentFile.id,false);
							}
							// 不显示已上传文件列表
							var exsitFileList = document
									.getElementById(this.customSettings.component.id
											+ "_list");
							if (exsitFileList) {
								exsitFileList.style.display = "none";
							}
						}
						// 处理新加入的文件的value
						var currentfile = {};
						currentfile.id = file.id;
						currentfile.name = file.name;
						if (this.settings.button_action == SWFUpload.BUTTON_ACTION.SELECT_FILE) {
							this.customSettings.newValue = currentfile;
						} else {
							if (!this.customSettings.newValue) {
								this.customSettings.newValue = [];
							}
							this.customSettings.newValue.push(currentfile);
						}
						// 更新input显示内容的内容
						//alert(this.settings.post_params.itemid)
						document
								.getElementById(this.settings.post_params.itemid).value = file.name;
						// 保存当前文件
						this.customSettings.component.currentFile = file;
						// 将文件加入队列
						var progress;
						progress = new FileProgress(file,
								this.customSettings.progressTarget,
								this.customSettings.component.showFileSize);
						progress.setStatus("等待中..");
						progress.toggleCancel(true, this);
						progress.toggleStatus(this.customSettings.showStatus);
						progress.toggleBar(this.customSettings.showBar);
						progress.appear();

					},

					// 文件加入文件队列的异常处理(执行顺序2.5)
					file_queue_error_function : function file_queue_error_function(
							file, errorCode, message) {

						if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {

							this.component.markInvalid("队列中文件过多.\n"
									+ (message === 0 ? "超过文件上传限制." : "你可以选择 "
											+ (message > 1 ? "最多" + message
													+ "个文件。" : "一个文件.")));

							return;
						}
						var progress = new FileProgress(file,
								this.customSettings.progressTarget,
								this.customSettings.component.showFileSize);
						progress
								.setError(this.customSettings.component.showErrorTime);
						if (this.customSettings.component.showErrorTime <= 0) {
							progress.toggleCancel(true, this);
						} else {
							progress.toggleCancel(false);
						}
						switch (errorCode) {
						case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
							progress.setStatus("文件过大。");
							break;
						case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
							progress.setStatus("不能上传0比特文件。");
							break;
						case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
							progress.setStatus("无效文件类型。");
							break;
						case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
							alert("选择了过多文件。  "
									+ (message > 1 ? "你只能再添加" + message + "个文件"
											: "不能添加更多文件。"));
							break;
						default:
							if (file !== null) {
								progress.setStatus("文件异常");
							}
							break;
						}
					},

					// 对话框关闭事件(执行顺序3)
					file_dialog_complete_function : function file_dialog_complete_function() {
						this.customSettings.component.onValueChange();

					},

					// 文件开始上传事件(执行顺序4)
					upload_start_function : function upload_start_function(file) {
						var progress = new FileProgress(file,
								this.customSettings.progressTarget,
								this.customSettings.component.showFileSize);
						progress.setStatus("上传中..");
						progress.toggleCancel(true);
						return true;
					},

					// 文件上传进行中事件(执行顺序5)
					upload_progress_function : function upload_progress_function(
							file, bytesLoaded, bytesTotal) {

						var percent = Math
								.ceil((bytesLoaded / bytesTotal) * 100);
						var progress = new FileProgress(file,
								this.customSettings.progressTarget,
								this.customSettings.component.showFileSize);
						progress.setProgress(percent);
						progress.setStatus("上传中..");

					},

					// 文件上传成功事件（一个文件上传成功时执行）(执行顺序5.5)
					upload_success_function : function upload_success_function(
							file, serverData) {
								if(!Ext.isEmpty(serverData)){
									if(/^arterycmd:.*\.jsp$/.test(serverData)){
										var loginUrl = serverData.replace(/arterycmd:/,"");
										alert(Artery.ajaxLoginTip)
										top.window.location.href=loginUrl;
										return;
									}
								}
						var progress = new FileProgress(file,
								this.customSettings.progressTarget,
								this.customSettings.component.showFileSize);

						// 取出callback队列（多文件全部传完后执行）
						if (this.getStats().files_queued == 0) {
							var callback = this.callbackQueue.pop();
							eval("var message=" + serverData + ";");
							if (message.success) {
								progress.setComplete();
								progress.setStatus("已完成");
								progress.toggleCancel(false);
								callback.call(this, message["return"]);
							}

						}

					},

					// 文件上传异常处理（文件上传出错时执行）(执行顺序5.5)
					upload_error_function : function upload_error_function(
							file, errorCode, message) {
						var progress = new FileProgress(file,
								this.customSettings.progressTarget,
								this.customSettings.component.showFileSize);
						progress
								.setError(this.customSettings.component.showErrorTime);
						switch (errorCode) {
						case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
							progress.setStatus("上传异常: " + message);
							break;
						case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:
							progress.setStatus("配置错误");
							break;
						case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
							progress.setStatus("Upload Failed.");
							break;
						case SWFUpload.UPLOAD_ERROR.IO_ERROR:
							progress.setStatus("服务器IO 异常");
							break;
						case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
							progress.setStatus("安全 异常");
							break;
						case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
							progress.setStatus("上传超过限制");
							break;
						case SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND:
							progress.setStatus("文件为找到。");
							break;
						case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
							progress.setStatus("文件验证失败，取消上传");
							break;
						case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:

							if (this.totalFileSize > this.customSettings.component.total_file_size_limit) {
								progress
										.setError(this.customSettings.component.showErrorTime);
								progress.setStatus("文件总大小超限");
							} else {
								progress.setStatus("已取消");
								progress
										.setCancelled(this.customSettings.component.showCancelTime);
								//					if (this.settings.button_action == SWFUpload.BUTTON_ACTION.SELECT_FILE) {
								//						// 如果已有文件删除已存在的文件
								//						if (this.customSettings.component.currentFile) {
								//							this.customSettings.component.currentFile = false;
								//						}
								//					}
							}
							this.totalFileSize -= file.size;
							this.customSettings.component
									.deleteFileValue(file.id);

							var inputFileName = "";
							if (this.customSettings.component.singleFile) {
								var file = this.customSettings.component.getFile();
								if (file) {
									inputFileName = file.name;
								}
							} else {
								var files = this.customSettings.component.getFile();
								if(files){
									inputFileName = files[files.length-1].name;
								}
							}
							document.getElementById(this.settings.post_params.itemid).value = inputFileName;
							break;
						case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
							progress.setStatus("已停止");
							break;
						default:
							progress
									.setError(this.customSettings.component.showErrorTime);
							progress.setStatus("上传失败");
							progress.toggleCancel(false);
							break;
						}

					},

					// 文件上传完成事件(执行顺序6)
					upload_complete_function : function upload_complete_function(
							file) {

						if (this.getStats().files_queued != 0) {
							this.startUpload();
						} else {
							// 不显示已上传文件列表
							if (document
									.getElementById(this.customSettings.component.id
											+ "_list")) {
								document
										.getElementById(this.customSettings.component.id
												+ "_list").style.display = "none";
							}

							// 修改input的内容
							document
									.getElementById(this.settings.post_params.itemid).value = "";
							
							Ext.select('a.x-flashUpload-progressCancel',false).each(function(el, cmp, idx) {
								el.removeClass('x-hide-display');
							});
						}

					},

					// //////////////////////////////////////////////////////////////
					// 对外公开的方法
					// //////////////////////////////////////////////////////////////

					// 启动上传方法（支持回调函数）
					startUpload : function startUpload(object) {
							var p = Artery.getParams({}, this);
							Artery.request({
							url : sys.getContextPath()
									+ "/artery/form/dealParse.do?action=CheckSessionOutTime&method=test;jsessionid="
									+ this.sessionid,
							scope : this,
							params : p,
							success : function(response, options) {
								var text = response.responseText;
								if(!Ext.isEmpty(text)){
									if(/^arterycmd:.*\.jsp$/.test(text)){
										var loginUrl = text.replace(/arterycmd:/,"");
										alert(Artery.ajaxLoginTip)
										top.window.location.href=loginUrl;
										return;
									}
									try{
										text = Ext.decode(text);
										text = text['return'];
									}catch(e){
										Artery.showError("出错啦，请检查！")
										return;
									}
								}
							}
						})
						if (object == null) {
							object = {
								params : {}
							};
						} else if (object.params == null) {
							object.params = {};
						}
						
						if (Artery.params) {
							Ext.apply(object.params, Artery.params);
						}
						if (object.params.itemid) {
							delete object.params.itemid;
						}
						if (object.params.formid) {
							delete object.params.formid;
						}
						Ext.select('a.x-flashUpload-progressCancel',false).each(function(el, cmp, idx) {
							el.addClass('x-hide-display');
						});
						// 单文件上传提交表单数据
						var formValues;
						if (this.singleFile) {
							var form = Artery.get(this.Other_form_ID);
							if (form != null) {
								if (form.isValid()) {
									formValues = form.getValues();
								} else {
									return;
								}
							}
						}
						// 验证本控件的值
						if (!this.validateValue(this.value)) {
							return;
						}
						// 如果有文件需要上传通过swfUpload上传
						if (!this.hidden && this.swfu.getStats().files_queued != 0) {
							// 提交回调中的参数
							Ext.iterate(object.params, function(key, value,
									Object) {
								this.swfu.addPostParam(key, value);
							}, this);
							// 上传提交调用此方法的按钮的id 用于调用此按钮的onClickServer
							if (Artery.params.itemid) {
								this.swfu.addPostParam("buttonItemid",
										Artery.params.itemid);
							}
							// 上传提交此控件删除的文件value字符串，以逗号隔开
							if (this.deleteFile) {
								this.swfu.addPostParam(this.id + "Clear",
										this.deleteFile);
							}
							// 单文件上传提交表单数据
							if (formValues) {
								Ext.iterate(formValues, function(key, value,
										Object) {
									this.swfu.addPostParam(key, value);
								}, this);
							}
							this.swfu.addPostParam("jsessionid",this.sessionid);
							
							// 启动上传
							this.swfu.startUpload();
							// 清除deletefile
							delete this.deleteFile;

							// 保存回调函数
							if (object.callback != null) {
								this.swfu.callbackQueue = new Array();
								this.swfu.callbackQueue.push(object.callback);
							}
						} else {
							// 如果没有文件需要上传直接通过ajax请求后台
							// 提交回调中的参数
							Ext.applyIf(object.params, {
								"formid" : this.formId,
								"itemid" : this.id,
								"itemType" : "flashUpload"
							});
							// 上传提交调用此方法的按钮的id 用于调用此按钮的onClickServer
							if (Artery.params.itemid) {
								object.params.buttonItemid = Artery.params.itemid;
							}
							// 上传提交此控件删除的文件value字符串，以逗号隔开
							if (this.deleteFile) {
								eval("object.params." + this.id + "Clear='"
										+ this.deleteFile + "';");
							}
							// 单文件上传提交表单数据
							if (formValues) {
								Ext.applyIf(object.params, formValues);
							}
							
							// 提交请求并调用回调函数
							Artery
									.request( {
										url : sys.getContextPath()
												+ "/artery/form/dealParse.do?action=runItemLogic&method=onUpload;jsessionid="
												+ this.sessionid,
										success : function(response, options) {
											// 清除deletefile
										delete this.deleteFile;
										// 调用回调函数
										if (object.callback != null
												&& typeof object.callback == "function") {
											object.callback.call(this,
													response.responseText);
										}
									},
									// 参数
										params : object.params,
										scope : this
									});
						}
					},
					removeUpload: function(){
						Ext.select('.x-flashUpload-progressWrapper').each(function(el, cmp, idx) {
							var movie = document.getElementById(el.dom.id);
							movie.style.display = "none";
						});
					},
					
					clearFileQueue:function(){
						while(this.getFileSize()!=0){
							this.swfu.cancelUpload(this.getFile()[0].id);
						}
	 					this.removeUpload();
					},
					GetCookie:function (name) {
						var arg = name + "=";
						var alen = arg.length;
						var clen = document.cookie.length;
						var i = 0;
						while (i < clen) {
							var j = i + alen;
							if (document.cookie.substring(i, j) == arg)
								return this.getCookieVal(j);
							i = document.cookie.indexOf(" ", i) + 1;
							if (i == 0)
								break;
						}
						return null;
					},
					
					getCookieVal:function(offset) {
						var endstr = document.cookie.indexOf(";", offset);
						if (endstr == -1)
							endstr = document.cookie.length;
						return unescape(document.cookie.substring(offset, endstr));
					},
					
					setValue :function (v) {		
						Ext.select('.x-flashUpload-progressWrapper').each(function(el, cmp, idx) {
							var movie = document.getElementById(el.dom.id);
							movie.style.display = "none";
						});
												
						this.value = v;
						if(this.isDisplayType()){
							if(this.el && !(this.el.dom.tagName.toLowerCase() =='input' && this.el.dom.type.toLowerCase()=='hidden')){
								this.el.dom.innerHTML = v;
							}
							return;
						}
						if (this.rendered) {
							if (this.el.dom.value != v) {
								this.el.dom.value = (v === null || v === undefined ? '' : v);
							}
							// modify
							// this.validate();
						}
						this.updateValueTip();
						this.afterSetValue();
					}
					,
					// 获取文件状态对象
					// in_progress : number // 1 或 0 代表文件是否正在上传
					// files_queued : number // 队列中的文件数
					// successful_uploads : number // 成功上传的队列
					// upload_errors : number // 出错的文件数量
					// upload_cancelled : number // 取消的文件数量
					// queue_errors : number // 出错导致未加入队列的文件数量
					getStats : function() {
						return this.swfu.getStats();
					},
					// 获取文件对象描述，文件对象包括
					// id : string, // 文件id
					// index : number, // 文件序号
					// name : string, // 文件名（不含路径）
					// size : number, // 文件大小（字节）
					// type : string, // 文件类型 （由操作返回）
					// creationdate : Date, // 文件创建时间
					// modificationdate : Date, // 文件修改时间
					// filestatus : number, // 文件状态可使用 SWFUpload.FILE_STATUS解析状态
					getFile : function() {
						if (this.singleFile) {
							if (this.currentFile) {
								return this.swfu.getFile(this.currentFile.id);
							}
						} else {
							var value = [];
							var count = 0;
							var i = 0;
							while (i < this.swfu.getStats().files_queued) {
								var file = this.swfu.getFile(count);
								if (file != null
										&& file.filestatus == SWFUpload.FILE_STATUS.QUEUED) {
									value[i] = file;
									i++;
								}
								count++;
							}
							if (value.length > 0) {
								return value;
							}
						}
						return null;
					},
					// 获取文件列表(仅限于上传队列中的文件)
					getFileName : function() {
						var s = "";
						if (this.singleFile) {
							file = this.getFile();
							if (file) {
								s = file.name;
							}
						} else {
							var files = this.getFile();
							if (files) {
								for ( var i = 0; i < files.length; i++) {
									var file = files[i];
									s += file.name + ",";
								}
								if (s.length > 0) {
									s = s.substring(0, s.length - 1);
								}
							}
						}
						return s;
					},

					// 获取文件大小(仅限于上传队列中的文件)
					getFileSize : function(unit) {
						var s = "";
						var sizeUnit = unit || "";
						if (this.singleFile) {
							var file = this.getFile();
							if (file) {
								if (sizeUnit.toLowerCase() == "kb") {
									size = file.size / 1024;
									size = size.toFixed(2);
								} else if (sizeUnit.toLowerCase() == "mb") {
									size = file.size / 1024 / 1024;
									size = size.toFixed(2);
								} else {
									size = file.size;
								}
								s += size;
							}
						} else {
							var files = this.getFile();
							if (files) {
								for ( var i = 0; i < files.length; i++) {
									var file = files[i];
									if (sizeUnit.toLowerCase() == "kb") {
										size = file.size / 1024;
										size = size.toFixed(2);
									} else if (sizeUnit.toLowerCase() == "mb") {
										size = file.size / 1024 / 1024;
										size = size.toFixed(2);
									} else {
										size = file.size;
									}
									s += size + ",";
								}
								if (s.length > 0) {
									s = s.substring(0, s.length - 1);
								}
							}
						}
						return s;
					},

					// 返回控件的值（文件名列表，包括已上传文件）
					getAllValues : function() {
						var newValueString = "";
						if (this.singleFile) {
							if (this.settings.custom_settings.newValue.name) {
								newValueString = this.settings.custom_settings.newValue.name;
							}
						} else {
							var newValueString = Ext.pluck(
									this.settings.custom_settings.newValue,
									"name").join();
						}
						return newValueString;
					},

					// 返回上传请求附带的删除文件的id
					getDeletedFile : function() {
						return this.deleteFile;
					},

					// 返回当前队列中的文件总大小
					getTotalFileSize : function() {
						return this.swfu.totalFileSize;
					},

					// 动态改变文件大小限制
					setFileSizeLimit : function(fileSize) {
						fileSize = fileSize * 1024;
						this.swfu.setFileSizeLimit(Math.floor(fileSize));
					},
					// 动态改变文件类型以及类型名称
					setFileTypes : function(types, description) {
						var typeArray = types.split(",");
						var typeString = "";
						Ext.each(typeArray, function(item, index, allitem) {
							typeString += "*." + item + ";";
						});
						if (typeString.length > 0) {
							typeString = typeString.substring(0,
									typeString.length - 1);
						}
						this.swfu.setFileTypes(typeString, description);
					},

					// 删除一个文件（private）
					deleteFileValue : function(id) {
						if (!this.settings.custom_settings.newValue) {
							return;
						}
						var deleteID = id;
						var setting = this.settings.custom_settings;
						if (this.singleFile) {
							if (setting.newValue.id == deleteID) {
								setting.newValue = {};
								setting.validate = false;
							}
						} else {
							var tempArray = [];

							Ext.each(this.settings.custom_settings.newValue,
									function(item, index, allItems) {
										if (deleteID != item.id) {
											tempArray.push(item);
										} else {
											setting.validate = false;
										}
									}, this);
							this.settings.custom_settings.newValue = tempArray;
						}

						this.onValueChange();

					},
					// 处理值改变事件（private）
					onValueChange : function() {
						if (this.settings.custom_settings.validate) {
							return;
						}
						if (this.settings.button_action == SWFUpload.BUTTON_ACTION.SELECT_FILE) {
							var newValueString = "";
							var oldValueString = "";
							if (this.settings.custom_settings.newValue
									&& this.settings.custom_settings.newValue.name) {
								newValueString = this.settings.custom_settings.newValue.name;
							}
							if (this.settings.custom_settings.oldValue
									&& this.settings.custom_settings.oldValue.name) {
								oldValueString = this.settings.custom_settings.oldValue.name;
							}
						} else {
							var newValueString = Ext.pluck(
									this.settings.custom_settings.newValue,
									"name").join();
							var oldValueString = Ext.pluck(
									this.settings.custom_settings.oldValue,
									"name").join();
						}
						Artery.regItemEvent(
								this.settings.custom_settings.component,
								'onChangeEvent', 'onChangeServer', {
									'newValue' : newValueString,
									'oldValue' : oldValueString
								});
						if (this.settings.button_action == SWFUpload.BUTTON_ACTION.SELECT_FILE) {
							this.settings.custom_settings.oldValue = this.settings.custom_settings.newValue;
						} else {
							this.settings.custom_settings.oldValue = [];
							var oldValueTemp = this.settings.custom_settings.oldValue;
							Ext.each(this.settings.custom_settings.newValue,
									function(item, index, allItems) {
										oldValueTemp.push(item);
									}, this);
						}

						this.settings.custom_settings.validate = true;
					},

					initComponent : function() {
						Artery.plugin.flashUpload.superclass.initComponent
								.call(this);
						this.sessionid = this.GetCookie("JSESSIONID")||this.sessionid;
						// 设置swfupload需要的json对象
						this.settings = {
							// 内部设置
							flash_url : sys.getContextPath()
									+ "/artery/arteryPlugin/tool/flashUpload/swfupload.swf",
							upload_url : sys.getContextPath()
									+ "/artery/form/dealParse.do?action=runItemLogic&method=onUpload;jsessionid="
									+ this.sessionid,
							preserve_relative_urls : true,
							file_post_name : this.submitName || this.id,
							post_params : {
								"formid" : this.formId,
								"itemid" : this.id,
								"itemType" : "flashUpload"
							},
							button_placeholder_id : this.id + "_chooseFile",
							custom_settings : {
								progressTarget : this.id + "_progress",
								showStatus : this.showStatus,
								showBar : this.showBar,
								// oldValue : this.value,
								component : this,
								validate : true
							},

							// 文件相关
							file_types : this.file_types,// 可上传的文件类型
							file_types_description : this.file_types_description,// 可上传的文件类型的别名
							file_size_limit : this.file_size_limit,// 文件大小上限
							file_queue_limit : this.file_queue_limit,// 最大允许在待传队列中的文件数量

							// 下载按钮外观
							button_width : this.button_width,
							button_height : this.button_height,
							button_text : this.button_text,
							button_text_style : this.button_text_style,
							button_text_left_padding : this.button_text_left_padding,
							button_text_top_padding : this.button_text_top_padding,
							button_disabled : this.buttonDisabled,
							// button_window_mode : SWFUpload.WINDOW_MODE.TRANSPARENT,

							// 事件处理
							swfupload_loaded_handler : this.swfupload_loaded_function,

							file_queued_handler : this.file_queued_function,
							file_queue_error_handler : this.file_queue_error_function,
							file_dialog_start_handler : this.file_dialog_start_function,
							file_dialog_complete_handler : this.file_dialog_complete_function,

							upload_start_handler : this.upload_start_function,
							upload_progress_handler : this.upload_progress_function,
							upload_error_handler : this.upload_error_function,
							upload_success_handler : this.upload_success_function,
							upload_complete_handler : this.upload_complete_function

						};
						// 按钮图片路径
						if (this.button_image_url != null) {
							this.settings.button_image_url = sys
									.getContextPath()
									+ this.button_image_url;
						}
						;
						// 鼠标移到按钮上时，是否使用手型鼠标样式
						if (this.handCursor == true) {
							this.settings.button_cursor = SWFUpload.CURSOR.HAND;
						}
						// 判断文件上传类型是单文件还是多文件
						if (this.singleFile == true) {
							this.settings.button_action = SWFUpload.BUTTON_ACTION.SELECT_FILE;
						} else {
							this.settings.button_action = SWFUpload.BUTTON_ACTION.SELECT_FILES;
						}

						// 处理宽度高度
						document.getElementById(this.id + "component").style.width = this.containerWidth;
						document.getElementById(this.id + "component").style.height = this.containerHeight;

						// 解析初始化时的value值,拼成文件名字符串
						var tempValue = "";
						if (this.value) {
							if (this.singleFile == true) {
								var file = Ext.util.JSON.decode(this.value);
								tempValue = {};
								tempValue.id = file.value;
								tempValue.name = file.name;
								this.settings.custom_settings.oldValue = Ext
										.apply( {}, tempValue);
								this.settings.custom_settings.newValue = Ext
										.apply( {}, tempValue);

							} else {
								var files = Ext.util.JSON.decode(this.value);
								tempValue = "[";
								for ( var i = 0; i < files.length - 1; i++) {
									tempValue += "{id:'" + files[i].value
											+ "',name:'" + files[i].name
											+ "'},";
								}
								tempValue += "{id:'"
										+ files[files.length - 1].value
										+ "',name:'"
										+ files[files.length - 1].name + "'}";
								tempValue += "]";
								tempValue = eval(tempValue);
								this.settings.custom_settings.oldValue = Ext
										.apply( [], tempValue);
								this.settings.custom_settings.newValue = Ext
										.apply( [], tempValue);

							}

							this.value = null;

						}

					},

					// 处理呈现事件
					onRender : function(ct, position) {
						this.el = Ext.get(this.id);
						if (!this.el) {
							Artery.plugin.flashUpload.superclass.onRender.call(
									this, ct, position);
						}
						this.settings.id=this.id;
						this.swfu = new SWFUpload(this.settings);

					},
					// 处理呈现后事件
					afterRender : function() {
						Artery.plugin.flashUpload.superclass.afterRender
								.call(this);
						// 是否禁用input
						if (this.inputDisabled) {
							this.disabled = true;
						}
					},

					// 表单自动验证调用的方法
					validateValue : function(value) {
						var newValueString = "";
						if (this.singleFile) {
							if (this.settings.custom_settings.newValue
									&& this.settings.custom_settings.newValue.name) {
								newValueString = this.settings.custom_settings.newValue.name;
							}
						} else {
							var newValueString = Ext.pluck(
									this.settings.custom_settings.newValue,
									"name").join();
						}

						// 处理验证时脚本

						if (Ext.isFunction(this.validator)) {
							var msg = this.validator(newValueString);
							if (msg !== true) {
								this.markInvalid(msg);
								return false;
							}
						}
						// 处理是否允许为空
						if (this.allowBlank == false) {
							if (Ext.isEmpty(newValueString)
									&& this.swfu.getStats().files_queued == 0) {
								this.markInvalid("请输入必填项");
								return false;
							}
						}
						this.clearInvalid();
						return true;
					}
				})
// 注册本组件
Ext.reg('apFlashUpload', Artery.plugin.flashUpload);