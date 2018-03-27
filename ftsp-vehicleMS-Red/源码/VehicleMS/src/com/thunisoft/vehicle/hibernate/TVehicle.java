package com.thunisoft.vehicle.hibernate;

import java.util.Date;

/**
 * TVehicle entity. @author MyEclipse Persistence Tools
 */
public class TVehicle extends AbstractTVehicle implements java.io.Serializable {

	// Constructors

	/** default constructor */
	public TVehicle() {
	}

	/** full constructor */
	public TVehicle(String CCarNumber, String CCarType, String CCarTypeName,
			Integer NSeat, String CBrand, String CResponseUserId,
			String CResponseUserName, String CNote, Date dtUpdateTime, Integer nIsAvailable) {
		super(CCarNumber, CCarType, CCarTypeName, NSeat, CBrand,
				CResponseUserId, CResponseUserName, CNote, dtUpdateTime, nIsAvailable);
	}

	@Override
	public String toString() {
//		return "TVehicle [getCId()=" + getCId() + ", getCCarNumber()="
//				+ getCCarNumber() + ", getCCarType()=" + getCCarType()
//				+ ", getCCarTypeName()=" + getCCarTypeName() + ", getNSeat()="
//				+ getNSeat() + ", getCBrand()=" + getCBrand()
//				+ ", getCResponseUserId()=" + getCResponseUserId()
//				+ ", getCResponseUserName()=" + getCResponseUserName()
//				+ ", getCNote()=" + getCNote() + ", getDtUpdateTime()="
//				+ getDtUpdateTime() + ", getNIsAvailable()="
//				+ getNIsAvailable() + ", getClass()=" + getClass()
//				+ ", hashCode()=" + hashCode() + ", toString()="
//				+ super.toString() + "]";
		return getCCarNumber();
	}
	
	

}
