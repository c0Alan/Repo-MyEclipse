package com.thunisoft.vehicle.hibernate;

import java.util.Date;

/**
 * AbstractTVehicleApply entity provides the base persistence definition of the
 * TVehicleApply entity. @author MyEclipse Persistence Tools
 */

public abstract class AbstractTVehicleApply implements java.io.Serializable {

	// Fields

	private String CId;
	private String CVehicleId;
	private String CApplyUserId;
	private String CApplyUserName;
	private String CReason;
	private Date dtStartTime;
	private Date dtEndTime;
	private String CDestination;
	private String CNote;
	private Date dtCreateTime;

	// Constructors

	/** default constructor */
	public AbstractTVehicleApply() {
	}

	/** minimal constructor */
	public AbstractTVehicleApply(String CVehicleId) {
		this.CVehicleId = CVehicleId;
	}

	/** full constructor */
	public AbstractTVehicleApply(String CVehicleId, String CApplyUserId,
			String CApplyUserName, String CReason, Date dtStartTime,
			Date dtEndTime, String CDestination, String CNote, Date dtCreateTime) {
		this.CVehicleId = CVehicleId;
		this.CApplyUserId = CApplyUserId;
		this.CApplyUserName = CApplyUserName;
		this.CReason = CReason;
		this.dtStartTime = dtStartTime;
		this.dtEndTime = dtEndTime;
		this.CDestination = CDestination;
		this.CNote = CNote;
		this.dtCreateTime = dtCreateTime;
	}

	// Property accessors

	public String getCId() {
		return this.CId;
	}

	public void setCId(String CId) {
		this.CId = CId;
	}

	public String getCVehicleId() {
		return this.CVehicleId;
	}

	public void setCVehicleId(String CVehicleId) {
		this.CVehicleId = CVehicleId;
	}

	public String getCApplyUserId() {
		return this.CApplyUserId;
	}

	public void setCApplyUserId(String CApplyUserId) {
		this.CApplyUserId = CApplyUserId;
	}

	public String getCApplyUserName() {
		return this.CApplyUserName;
	}

	public void setCApplyUserName(String CApplyUserName) {
		this.CApplyUserName = CApplyUserName;
	}

	public String getCReason() {
		return this.CReason;
	}

	public void setCReason(String CReason) {
		this.CReason = CReason;
	}

	public Date getDtStartTime() {
		return this.dtStartTime;
	}

	public void setDtStartTime(Date dtStartTime) {
		this.dtStartTime = dtStartTime;
	}

	public Date getDtEndTime() {
		return this.dtEndTime;
	}

	public void setDtEndTime(Date dtEndTime) {
		this.dtEndTime = dtEndTime;
	}

	public String getCDestination() {
		return this.CDestination;
	}

	public void setCDestination(String CDestination) {
		this.CDestination = CDestination;
	}

	public String getCNote() {
		return this.CNote;
	}

	public void setCNote(String CNote) {
		this.CNote = CNote;
	}

	public Date getDtCreateTime() {
		return this.dtCreateTime;
	}

	public void setDtCreateTime(Date dtCreateTime) {
		this.dtCreateTime = dtCreateTime;
	}
	
	

}