function FileProgress(file, targetID) {
	this.fileProgressID = file.id;

	this.opacity = 100;
	this.height = 0;

	this.fileProgressWrapper = document.getElementById(this.fileProgressID);
	if (!this.fileProgressWrapper) {
		this.fileProgressWrapper = document.createElement("div");
		this.fileProgressWrapper.className = "x-flashUpload-progressWrapper";
		this.fileProgressWrapper.id = this.fileProgressID;

		this.fileProgressElement = document.createElement("div");
		this.fileProgressElement.className = "x-flashUpload-progressContainer";

		var progressCancel = document.createElement("a");
		progressCancel.className = "x-flashUpload-progressCancel";
		progressCancel.href = "#";
		progressCancel.style.visibility = "hidden";
		progressCancel.innerHTML = 'click'
		progressCancel.appendChild(document.createTextNode(" "));

		var progressText = document.createElement("div");
		progressText.className = "x-flashUpload-progressName";
		progressText.appendChild(document.createTextNode(file.name));

		var progressBar = document.createElement("div");
		progressBar.className = "x-flashUpload-progressBarInProgress";

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
FileProgress.prototype.setComplete = function() {
	this.fileProgressElement.className = "x-flashUpload-progressContainer x-flashUpload-blue";
	this.fileProgressElement.childNodes[3].className = "x-flashUpload-progressBarComplete";
	this.fileProgressElement.childNodes[3].style.width = "";

	var oSelf = this;
	this.setTimer(setTimeout(function() {
				oSelf.disappear();
			}, 2000));
};
FileProgress.prototype.setError = function() {
	this.fileProgressElement.className = "x-flashUpload-progressContainer x-flashUpload-red";
	this.fileProgressElement.childNodes[3].className = "x-flashUpload-progressBarError";
	this.fileProgressElement.childNodes[3].style.width = "";

	var oSelf = this;
	this.setTimer(setTimeout(function() {
				oSelf.disappear();
			}, 2000));
};
FileProgress.prototype.setCancelled = function() {
	this.fileProgressElement.className = "x-flashUpload-progressContainer";
	this.fileProgressElement.childNodes[3].className = "x-flashUpload-progressBarError";
	this.fileProgressElement.childNodes[3].style.width = "";

	var oSelf = this;
	this.setTimer(setTimeout(function() {
				oSelf.disappear();
			}, 2000));

};
FileProgress.prototype.setStatus = function(status) {
	this.fileProgressElement.childNodes[2].innerHTML = status;
};

// Show/Hide the cancel button
FileProgress.prototype.toggleCancel = function(show, swfUploadInstance) {
	this.fileProgressElement.childNodes[0].style.visibility = show
			? "visible"
			: "hidden";

	if (swfUploadInstance) {
		var fileID = this.fileProgressID;
		this.fileProgressElement.childNodes[0].onclick = function() {
			swfUploadInstance.cancelUpload(fileID);
			return false;
		};
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
	this.fileProgressWrapper.style.display = "";
};

//处理文件删除消失
FileProgress.prototype.disappear = function() {

	var reduceOpacityBy = 15;
	var reduceHeightBy = 4;
	var rate = 30; // 15 fps

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
	this.fileProgressElement.childNodes[2].style.display = flag
			? "block"
			: "none";

}
FileProgress.prototype.toggleBar = function(flag) {
	this.fileProgressElement.childNodes[3].style.display = flag
			? "block"
			: "none";
}