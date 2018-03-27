package com.thunisoft.vehicle.hibernate;

import java.util.Date;

/**
 * TVehicleApply entity. @author MyEclipse Persistence Tools
 */
public class TVehicleApply extends AbstractTVehicleApply implements
		java.io.Serializable {

	// Constructors

	/** default constructor */
	public TVehicleApply() {
	}

	/** minimal constructor */
	public TVehicleApply(String CVehicleId) {
		super(CVehicleId);
	}

	/** full constructor */
	public TVehicleApply(String CVehicleId, String CApplyUserId,
			String CApplyUserName, String CReason, Date dtStartTime,
			Date dtEndTime, String CDestination, String CNote, Date dtCreateTime) {
		super(CVehicleId, CApplyUserId, CApplyUserName, CReason, dtStartTime,
				dtEndTime, CDestination, CNote, dtCreateTime);
	}

}
