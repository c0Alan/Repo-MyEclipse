package com.thunisoft.vehicle.hibernate;

import java.util.Date;

/**
 * AbstractTVehicle entity provides the base persistence definition of the
 * TVehicle entity. @author MyEclipse Persistence Tools
 */

public abstract class AbstractTVehicle implements java.io.Serializable {

	// Fields

	private String CId;
	private String CCarNumber;
	private String CCarType;
	private String CCarTypeName;
	private Integer NSeat;
	private String CBrand;
	private String CResponseUserId;
	private String CResponseUserName;
	private String CNote;
	private Date dtUpdateTime;
	private Integer NIsAvailable;

	// Constructors

	/** default constructor */
	public AbstractTVehicle() {
	}

	/** full constructor */
	public AbstractTVehicle(String CCarNumber, String CCarType,
			String CCarTypeName, Integer NSeat, String CBrand,
			String CResponseUserId, String CResponseUserName, String CNote,
			Date dtUpdateTime, Integer NIsAvailable) {
		this.CCarNumber = CCarNumber;
		this.CCarType = CCarType;
		this.CCarTypeName = CCarTypeName;
		this.NSeat = NSeat;
		this.CBrand = CBrand;
		this.CResponseUserId = CResponseUserId;
		this.CResponseUserName = CResponseUserName;
		this.CNote = CNote;
		this.dtUpdateTime = dtUpdateTime;
		this.NIsAvailable = NIsAvailable;
	}

	// Property accessors

	public String getCId() {
		return this.CId;
	}

	public void setCId(String CId) {
		this.CId = CId;
	}

	public String getCCarNumber() {
		return this.CCarNumber;
	}

	public void setCCarNumber(String CCarNumber) {
		this.CCarNumber = CCarNumber;
	}

	public String getCCarType() {
		return this.CCarType;
	}

	public void setCCarType(String CCarType) {
		this.CCarType = CCarType;
	}

	public String getCCarTypeName() {
		return this.CCarTypeName;
	}

	public void setCCarTypeName(String CCarTypeName) {
		this.CCarTypeName = CCarTypeName;
	}

	public Integer getNSeat() {
		return this.NSeat;
	}

	public void setNSeat(Integer NSeat) {
		this.NSeat = NSeat;
	}

	public String getCBrand() {
		return this.CBrand;
	}

	public void setCBrand(String CBrand) {
		this.CBrand = CBrand;
	}

	public String getCResponseUserId() {
		return this.CResponseUserId;
	}

	public void setCResponseUserId(String CResponseUserId) {
		this.CResponseUserId = CResponseUserId;
	}

	public String getCResponseUserName() {
		return this.CResponseUserName;
	}

	public void setCResponseUserName(String CResponseUserName) {
		this.CResponseUserName = CResponseUserName;
	}

	public String getCNote() {
		return this.CNote;
	}

	public void setCNote(String CNote) {
		this.CNote = CNote;
	}

	public Date getDtUpdateTime() {
		return this.dtUpdateTime;
	}

	public void setDtUpdateTime(Date dtUpdateTime) {
		this.dtUpdateTime = dtUpdateTime;
	}

	public Integer getNIsAvailable() {
		return this.NIsAvailable;
	}

	public void setNIsAvailable(Integer NIsAvailable) {
		this.NIsAvailable = NIsAvailable;
	}

}