function FileProgress(file, targetID, showFileSize) {
	this.fileProgressID = file.id;
	this.opacity = 100;
	this.height = 0;
	this.showFileSize = showFileSize;

	this.fileProgressWrapper = document.getElementById(this.fileProgressID);
	if (!this.fileProgressWrapper) {
		this.fileProgressWrapper = document.createElement("div");
		this.fileProgressWrapper.className = "x-flashUpload-progressWrapper";
		this.fileProgressWrapper.id = this.fileProgressID;
		// 每个文件状态的容器
		this.fileProgressElement = document.createElement("div");
		this.fileProgressElement.className = "x-flashUpload-progressContainer";
		// 每个文件状态的容器内的取消按钮
		var progressCancel = document.createElement("a");
		progressCancel.className = "x-flashUpload-progressCancel";
//		progressCancel.href = "#";
		progressCancel.style.visibility = "hidden";
		progressCancel.innerHTML = 'click'
		progressCancel.appendChild(document.createTextNode(" "));

		// 每个文件状态的容器内的文字
		var progressText = document.createElement("div");
		progressText.className = "x-flashUpload-progressName";
		if (this.showFileSize) {
			var fileInfoText = file.name + "  ("+ Number(file.size / 1024 / 1024).toFixed(2) + "MB)";
			progressText.appendChild(document.createTextNode(fileInfoText));
			this.fileProgressElement.title = fileInfoText;
		} else {
			progressText.appendChild(document.createTextNode(file.name));
			this.fileProgressElement.title = file.name;
		}

		// 每个文件状态的容器内的状态栏
		var progressBar = document.createElement("div");
		progressBar.className = "x-flashUpload-progressBarInProgress";
		// 每个文件状态的容器内的状态提示
		var progressStatus = document.createElement("div");
		progressStatus.className = "x-flashUpload-progressBarStatus";
		progressStatus.innerHTML = "&nbsp;";
	
		this.fileProgressElement.appendChild(progressCancel);
		this.fileProgressElement.appendChild(progressText);
		this.fileProgressElement.appendChild(progressStatus);
		this.fileProgressElement.appendChild(progressBar);
		this.fileProgressWrapper.appendChild(this.fileProgressElement);
		document.getElementById(targetID).appendChild(this.fileProgressWrapper);

	} else {
		this.fileProgressElement = this.fileProgressWrapper.firstChild;
//		this.fileProgressElement.style.display="none";
		this.reset();
	}

	this.height = this.fileProgressWrapper.offsetHeight;
	this.setTimer(null);

}

FileProgress.prototype.setTimer = function(timer) {
	this.fileProgressElement["FP_TIMER"] = timer;
};

FileProgress.prototype.getTimer = function(timer) {
	return this.fileProgressElement["FP_TIMER"] || null;
};

FileProgress.prototype.reset = function() {
	this.fileProgressElement.className = "x-flashUpload-progressContainer";
	this.fileProgressElement.childNodes[2].innerHTML = "&nbsp;";
	this.fileProgressElement.childNodes[2].className = "x-flashUpload-progressBarStatus";
	this.fileProgressElement.childNodes[3].className = "x-flashUpload-progressBarInProgress";
	this.fileProgressElement.childNodes[3].style.width = "0%";
	this.appear();
};

FileProgress.prototype.setProgress = function(percentage) {
	this.fileProgressElement.className = "x-flashUpload-progressContainer x-flashUpload-green";
	this.fileProgressElement.childNodes[3].className = "x-flashUpload-progressBarInProgress";
	this.fileProgressElement.childNodes[3].style.width = percentage + "%";
	this.appear();
};

FileProgress.prototype.setComplete = function(showTime) {
	this.fileProgressElement.className = "x-flashUpload-progressContainer x-flashUpload-blue";
	this.fileProgressElement.childNodes[3].className = "x-flashUpload-progressBarComplete";
	this.fileProgressElement.childNodes[3].style.width = "";
};

FileProgress.prototype.setError = function(showTime) {
	this.fileProgressElement.className = "x-flashUpload-progressContainer x-flashUpload-red";
	this.fileProgressElement.childNodes[3].className = "x-flashUpload-progressBarError";
	this.fileProgressElement.childNodes[3].style.width = "";

	if (showTime) {
		var interval = 2000;
		try {
			interval = Number(showTime);
		} catch (e) {

		}

		if (showTime > 0) {
			var oSelf = this;
			this.setTimer(setTimeout(function() {
				oSelf.disappear();
			}, interval));

		} else {
			this.disappear();
		}
	}

};

FileProgress.prototype.setCancelled = function(showTime) {
	this.fileProgressElement.className = "x-flashUpload-progressContainer";
	this.fileProgressElement.childNodes[3].className = "x-flashUpload-progressBarError";
	this.fileProgressElement.childNodes[3].style.width = "";
	this.fileProgressElement.childNodes[0].style.display = "none";
	if (showTime) {
		var interval = 2000;
		try {
			interval = Number(showTime);
		} catch (e) {

		}
		var oSelf = this;
		if (showTime > 0) {
			this.setTimer(setTimeout(function() {
				oSelf.disappear();
			}, interval));
		} else {
			this.setTimer(setTimeout(function() {
				oSelf.disappear();
			}, 2000));
		}

	}
};
FileProgress.prototype.setStatus = function(status) {
	this.fileProgressElement.childNodes[2].innerHTML = status;
};

/*
 * 控制是否开启取消文件上传的按钮，第二个参数不写不控制文件队列， 如果写会尝试在有取消按钮时，点击取消按钮取消文件上传 如果没有取消按钮，会直接取消上传
 * 
 */
FileProgress.prototype.toggleCancel = function(show, swfUploadInstance) {
	// 取消cancel按钮显示
	this.fileProgressElement.childNodes[0].style.visibility = show ? "visible"
			: "hidden";
	// 取消内部上传队列中的特定文件
	var current = this;
	if (swfUploadInstance) {
		var currentFile = swfUploadInstance.getFile(current.fileProgressID);
		if (show) {
			this.fileProgressElement.childNodes[0].onclick = function() {
				// 取消内部上传队列中的特定文件
				current.fileProgressElement.childNodes[0].style.visibility = "hidden";
				if (currentFile) {
					swfUploadInstance.cancelUpload(current.fileProgressID);
				}
			};
		} else {
			if (currentFile) {
				swfUploadInstance.cancelUpload(current.fileProgressID);
			}
		}
	}
};

FileProgress.prototype.appear = function() {
	if (this.getTimer() !== null) {
		clearTimeout(this.getTimer());
		this.setTimer(null);
	}
	if (this.fileProgressWrapper.filters) {
		try {
			this.fileProgressWrapper.filters
					.item("DXImageTransform.Microsoft.Alpha").opacity = 100;
		} catch (e) {
			this.fileProgressWrapper.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=100)";
		}
	} else {
		this.fileProgressWrapper.style.opacity = 1;
	}
	this.fileProgressWrapper.style.height = "";
	this.height = this.fileProgressWrapper.offsetHeight;
	this.opacity = 100;
//	this.fileProgressWrapper.style.display = "";
};

// 处理文件删除消失
FileProgress.prototype.disappear = function() {

	var reduceOpacityBy = 5;
	var reduceHeightBy = 1;
	var rate = 1;

	if (this.opacity > 0) {
		this.opacity -= reduceOpacityBy;
		if (this.opacity < 0) {
			this.opacity = 0;
		}

		if (this.fileProgressWrapper.filters) {
			try {
				this.fileProgressWrapper.filters
						.item("DXImageTransform.Microsoft.Alpha").opacity = this.opacity;
			} catch (e) {
				this.fileProgressWrapper.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity="
						+ this.opacity + ")";
			}
		} else {
			this.fileProgressWrapper.style.opacity = this.opacity / 100;
		}
	}

	if (this.height > 0) {
		this.height -= reduceHeightBy;
		if (this.height < 0) {
			this.height = 0;
		}

		this.fileProgressWrapper.style.height = this.height + "px";
	}

	if (this.height > 0 || this.opacity > 0) {
		var oSelf = this;
		this.setTimer(setTimeout(function() {
			oSelf.disappear();
		}, rate));
	} else {
		this.fileProgressWrapper.style.display = "none";
		this.setTimer(null);
	}
};

FileProgress.prototype.toggleStatus = function(flag) {
	this.fileProgressElement.childNodes[2].style.display = flag ? "block"
			: "none";
}

FileProgress.prototype.toggleBar = function(flag) {
	this.fileProgressElement.childNodes[3].style.display = flag ? "block"
			: "none";
}
