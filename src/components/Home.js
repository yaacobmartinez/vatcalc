import React from "react";
import {
	Typography,
	makeStyles,
	Container,
	Paper,
	Grid,
	InputBase,
	Divider,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
} from "@material-ui/core";
import CustomAppBar from "./CustomAppBar";

const useStyles = makeStyles((theme) => ({
	root: {
		padding: theme.spacing(2, 0),
	},
	paper: {
		margin: theme.spacing(2, 0),
		padding: theme.spacing(2),
		background: "aliceblue",
	},
	flexColumn: {
		display: "flex",
		alignItems: "center",
	},
	nakedInput: { flex: 1, marginLeft: 10 },
	nakedInputRight: {
		flex: 1,
		marginRight: 10,
		"& .MuiInputBase-input": { textAlign: "right" },
	},
	rightAlignedColumn: { textAlign: "right" },
}));
function Home() {
	const classes = useStyles();
	const [vendorDetails, setVendorDetails] = React.useState({
		name: "Company A",
		vatStatus: "VAT Registered",
		quotedVatStatus: "VATInc",
		totalMaterialCost: 0,
		totalLaborCost: 0,
		totalCost: 0,
		ewRate: 10,
		orderDiscountAppliedOn: "VATInc Price",
		rateOfCostDiscount: 10,
		orderDiscountedOn: "Total Cost",
		fixedAmount: 1000,
		fixedAmountDiscountedOn: "Material Cost",
	});
	const shipmentcost = 1200;
	let totals = {
		OrderDiscountAppliedOnVATIncMC: 0,
		OrderDiscountAppliedOnVATIncLC: 0,
		OrderDiscountAppliedOnVATIncTotal: 0,
	};
	let vats = {
		lessVATMC: 0,
		lessVATLC: 0,
		lessVATtotal: 0,
	};
	let vatex = {
		VATExMC: 0,
		VATExLC: 0,
		VATExTotal: 0,
	};
	let vatexDiscounts = {
		VATExDiscountMC: 0,
		VATExDiscountLC: 0,
		VATExDiscountTotal: 0,
	};
	let discountedTotalCosts = {
		MC: 0,
		LC: 0,
		total: 0,
	};
	let addVat = {
		MC: 0,
		LC: 0,
		total: 0,
	};
	const handleVendorDetailsChange = (e) => {
		setVendorDetails({ ...vendorDetails, [e.target.name]: e.target.value });
		// if (
		// 	e.target.name === "totalMaterialCost" ||
		// 	e.target.name === "totalLaborCost"
		// ) {
		// 	setVendorDetails({
		// 		...vendorDetails,
		// 		[e.target.name]: e.target.value,
		// 		totalCost:
		// 			parseInt(vendorDetails.totalMaterialCost) +
		// 			parseInt(vendorDetails.totalLaborCost),
		// 	});
		// }
	};

	const checkVatStatus = (value) => {
		if (vendorDetails.totalMaterialCost === 0) {
			return "---";
		}
		if (vendorDetails.vatStatus === "VAT Registered") {
			if (vendorDetails.quotedVatStatus === "VATInc") {
				return parseFloat(value).toFixed(2);
			}
			return "---";
		}
		return "---";
	};

	const checkLessVat = (value, item, cost) => {
		if (vendorDetails.totalMaterialCost === 0) {
			return "---";
		}
		const parsedValue = checkVatStatus(value);
		if (parsedValue === "---") {
			return "---";
		}
		const lessVat = (parseFloat(parsedValue) - parseFloat(item)) * 0.12;

		if (cost === "Material Cost") {
			vats["lessVATMC"] = lessVat;
			vats["lessVATtotal"] = (
				parseFloat(lessVat) + parseFloat(vats["lessVATLC"])
			).toFixed(2);
		}
		if (cost === "LC") {
			vats["lessVATLC"] = lessVat;
			vats["lessVATtotal"] = (
				parseFloat(lessVat) + parseFloat(vats["lessVATMC"])
			).toFixed(2);
		}
		return parseFloat(lessVat).toFixed(2);
	};
	const computeVatEx = (item) => {
		if (vendorDetails.vatStatus === "Non-VAT Registered") {
			return;
		}
		if (item === "Material Cost") {
			if (vendorDetails.quotedVatStatus === "VATEx") {
				vatex["VATExMC"] = vendorDetails.totalMaterialCost;
				vatex["VATExTotal"] =
					parseFloat(vatex["VATExLC"]) + parseFloat(vatex["VATExMC"]);
				return parseFloat(vatex["VATExMC"]).toFixed(2);
			}
			const vatexMC =
				parseFloat(vendorDetails.totalMaterialCost) -
				parseFloat(totals["OrderDiscountAppliedOnVATIncMC"]) -
				parseFloat(vats["lessVATMC"]);
			vatex["VATExMC"] = vatexMC;
			vatex["VATExTotal"] = vatex["VATExLC"] + vatexMC;
			return parseFloat(vatexMC).toFixed(2);
		}

		if (vendorDetails.quotedVatStatus === "VATEx") {
			vatex["VATExLC"] = vendorDetails.totalLaborCost;
			vatex["VATExTotal"] =
				parseFloat(vatex["VATExLC"]) + parseFloat(vatex["VATExMC"]);
			return parseFloat(vatex["VATExLC"]).toFixed(2);
		}
		const vatexLC =
			parseFloat(vendorDetails.totalLaborCost) -
			parseFloat(totals["OrderDiscountAppliedOnVATIncLC"]) -
			parseFloat(vats["lessVATLC"]);
		vatex["VATExLC"] = vatexLC;
		vatex["VATExTotal"] = vatex["VATExMC"] + vatexLC;
		return parseFloat(vatexLC).toFixed(2);
	};
	const checkOrderDiscount = (item, discountOn) => {
		if (vendorDetails.totalMaterialCost === 0) {
			return "---";
		}
		if (vendorDetails.vatStatus === "VAT Registered") {
			if (vendorDetails.quotedVatStatus === "VATInc") {
				if (vendorDetails.orderDiscountAppliedOn === "VATEx Price") {
					return "---";
				}
				if (
					vendorDetails.orderDiscountedOn === discountOn ||
					vendorDetails.orderDiscountedOn === "Total Cost"
				) {
					let parsedValue =
						parseFloat(item) / parseFloat(vendorDetails.rateOfCostDiscount);
					// parseInt(vendorDetails.fixedAmount);
					if (discountOn === "Material Cost") {
						if (vendorDetails.fixedAmountDiscountedOn === "Material Cost") {
							parsedValue += parseFloat(vendorDetails.fixedAmount);
						}
						totals["OrderDiscountAppliedOnVATIncMC"] = parsedValue;
						totals["OrderDiscountAppliedOnVATIncTotal"] =
							parsedValue +
							parseFloat(totals["OrderDiscountAppliedOnVATIncLC"]);
						return parseFloat(parsedValue).toFixed(2);
					}
					if (discountOn === "L&E Cost") {
						if (vendorDetails.fixedAmountDiscountedOn === "L&E Cost") {
							parsedValue += parseFloat(vendorDetails.fixedAmount);
						}
						totals["OrderDiscountAppliedOnVATIncLC"] = parsedValue;
						totals["OrderDiscountAppliedOnVATIncTotal"] =
							parsedValue + totals["OrderDiscountAppliedOnVATIncMC"];
						return parseFloat(parsedValue).toFixed(2);
					}
				}
				return "---";
			}
			return "---";
		}
	};

	const vatexDiscount = (value) => {
		if (vendorDetails.orderDiscountAppliedOn === "VATInc Price") {
			return "---";
		}
		let a, b;
		if (vendorDetails.fixedAmountDiscountedOn === value) {
			b = vendorDetails.fixedAmount;
		} else {
			b = 0;
		}
		if (vendorDetails.quotedVatStatus === "VATInc") {
			if (
				vendorDetails.orderDiscountedOn === value ||
				vendorDetails.orderDiscountedOn === "Total Cost"
			) {
				if (value === "Material Cost") {
					a =
						(parseFloat(vendorDetails.totalMaterialCost) -
							parseFloat(vats["lessVATMC"])) /
						vendorDetails.rateOfCostDiscount;
				} else if (value === "L&E Cost") {
					a =
						(parseFloat(vendorDetails.totalLaborCost) -
							parseFloat(vats["lessVATLC"])) /
						vendorDetails.rateOfCostDiscount;
				} else {
					a = 0;
				}
			}
		} else if (
			vendorDetails.orderDiscountedOn === value ||
			vendorDetails.orderDiscountedOn === "Total Cost"
		) {
			if (value === "Material Cost") {
				a =
					parseFloat(vats["VATExMC"]) /
					parseFloat(vendorDetails.rateOfCostDiscount);
			} else if (value === "L&E Cost") {
				a =
					parseFloat(vats["VATExLC"]) /
					parseFloat(vendorDetails.rateOfCostDiscount);
			} else {
				a = 0;
			}
		}
		const x = parseFloat(a) + parseFloat(b);
		if (value === "Material Cost") {
			if (vendorDetails.vatStatus === "Non-VAT Registered") {
				vatexDiscounts["VATExDiscountMC"] = vendorDetails.fixedAmount;
				vatexDiscounts["VATExDiscountLC"] = 0;
				vatexDiscounts["VATExDiscountTotal"] = vendorDetails.fixedAmount;
				return parseFloat(vendorDetails.fixedAmount).toFixed(2);
			}
			vatexDiscounts["VATExDiscountMC"] = x;
			vatexDiscounts["VATExDiscountTotal"] =
				x + vatexDiscounts["VATExDiscountLC"];
		} else {
			if (vendorDetails.vatStatus === "Non-VAT Registered") {
				return;
			}
			vatexDiscounts["VATExDiscountLC"] = x;
			vatexDiscounts["VATExDiscountTotal"] =
				x + vatexDiscounts["VATExDiscountMC"];
		}
		return parseFloat(x).toFixed(2);
	};

	const totalAmountPayable = () => {
		const discountedCosts = discountedTotalCosts["total"];
		const vatableSales = addVat["total"];
		const lessEWT = discountedTotalCosts["LC"] / vendorDetails.ewRate;
		const total =
			parseFloat(discountedCosts) +
			parseFloat(vatableSales) -
			parseFloat(lessEWT) +
			parseFloat(shipmentcost);
		return parseFloat(total).toFixed(2);
	};
	const discountTotalCost = (value) => {
		let a;
		if (value === "Material Cost") {
			if (
				vendorDetails.vatStatus === "Non-VAT Registered" &&
				vendorDetails.totalMaterialCost !== 0
			) {
				discountedTotalCosts["MC"] = vendorDetails.fixedAmount;
				discountedTotalCosts["LC"] = 0;
				discountedTotalCosts["total"] = vendorDetails.fixedAmount;
				return parseFloat(vendorDetails.fixedAmount).toFixed(2);
			}
			a = vatex["VATExMC"];
			if (vendorDetails.quotedVatStatus === "VATInc") {
				a = vendorDetails.totalMaterialCost;
			}
			const total =
				parseFloat(a) -
				parseFloat(totals["OrderDiscountAppliedOnVATIncMC"]) -
				parseFloat(vats["lessVATMC"]) -
				parseFloat(vatexDiscounts["VATExDiscountMC"]);
			discountedTotalCosts["MC"] = total;
			discountedTotalCosts["total"] = total + discountedTotalCosts["LC"];
			return parseFloat(total).toFixed(2);
		}
		if (vendorDetails.vatStatus === "Non-VAT Registered") {
			return;
		}
		a = vatex["VATExLC"];
		if (vendorDetails.quotedVatStatus === "VATInc") {
			a = vendorDetails.totalLaborCost;
		}
		const total =
			parseFloat(a) -
			parseFloat(totals["OrderDiscountAppliedOnVATIncLC"]) -
			parseFloat(vats["lessVATLC"]) -
			parseFloat(vatexDiscounts["VATExDiscountLC"]);
		discountedTotalCosts["LC"] = total;
		discountedTotalCosts["total"] = total + discountedTotalCosts["MC"];
		return parseFloat(total).toFixed(2);
	};

	const addVatTotal = (value) => {
		if (vendorDetails.vatStatus === "Non-VAT Registered") {
			addVat["LC"] = 0;
			addVat["MC"] = 0;
			addVat["total"] = 0;
			return "---";
		}
		if (value === "Material Cost") {
			const a = discountedTotalCosts["MC"];
			const total = parseFloat(a) * 0.12;
			addVat["MC"] = total;
			addVat["total"] = total + addVat["LC"];
			return parseFloat(total).toFixed(2);
		}
		const a = discountedTotalCosts["LC"];
		const total = parseFloat(a) * 0.12;
		addVat["LC"] = total;
		addVat["total"] = total + addVat["MC"];
		return parseFloat(total).toFixed(2);
	};
	const computeTotalCost = () => {
		const total =
			parseFloat(vendorDetails.totalMaterialCost) +
			parseFloat(vendorDetails.totalLaborCost);
		return setVendorDetails({ ...vendorDetails, totalCost: total });
	};
	return (
		<div>
			<CustomAppBar />
			<Container>
				<div className={classes.root}>
					<Typography variant='h6'>Vendor Payment Calculator</Typography>
					<Paper className={classes.paper} elevation={1}>
						<Typography gutterBottom>Vendor Details</Typography>
						{/* Vendor Details */}
						<Grid container>
							<Grid item xs={12} sm={6} className={classes.flexColumn}>
								<Typography variant='button'>Vendor Name: </Typography>
								<InputBase
									name='name'
									value={vendorDetails.name}
									onKeyPress={computeTotalCost}
									onChange={handleVendorDetailsChange}
									className={classes.nakedInput}
								/>
							</Grid>
							<Grid item xs={12} sm={6} className={classes.flexColumn}>
								<Typography variant='button'>Total Material Cost: </Typography>
								<InputBase
									name='totalMaterialCost'
									value={vendorDetails.totalMaterialCost}
									onKeyPress={computeTotalCost}
									onChange={handleVendorDetailsChange}
									type='number'
									className={classes.nakedInputRight}
								/>
								<Typography>({vendorDetails.quotedVatStatus})</Typography>
							</Grid>
							<Grid item xs={12} sm={6} className={classes.flexColumn}>
								<Typography variant='button'>Vendor VAT Status: </Typography>
								<InputBase
									name='vatStatus'
									value={vendorDetails.vatStatus}
									readOnly={true}
									className={classes.nakedInput}
								/>
							</Grid>
							<Grid item xs={12} sm={6} className={classes.flexColumn}>
								<Typography variant='button'>Total Labor Cost: </Typography>
								<InputBase
									name='totalLaborCost'
									value={vendorDetails.totalLaborCost}
									onChange={handleVendorDetailsChange}
									type='number'
									className={classes.nakedInputRight}
								/>
								<Typography>({vendorDetails.quotedVatStatus})</Typography>
							</Grid>
							<Grid item xs={12} sm={6} className={classes.flexColumn} />
							<Grid item xs={12} sm={6} className={classes.flexColumn}>
								{/* <Typography variant='button'>TOTAL COST: </Typography>
								<InputBase
									name='totalCost'
									value={vendorDetails.totalCost}
									readOnly={true}
									className={classes.nakedInputRight}
								/>
								<Typography>({vendorDetails.quotedVatStatus})</Typography> */}
							</Grid>
						</Grid>
						<Divider style={{ marginTop: 20, marginBottom: 20 }} />
						<Typography gutterBottom>Controls</Typography>
						{/* Controls */}
						<Grid container spacing={1}>
							{/* Vat Status */}
							<Grid item xs={12} sm={4}>
								<FormControl fullWidth variant='outlined'>
									<InputLabel>Vendor VAT Status</InputLabel>
									<Select
										value={vendorDetails.vatStatus}
										label='Vendor VAT Status'
										name='vatStatus'
										onChange={handleVendorDetailsChange}>
										<MenuItem value='VAT Registered'>VAT</MenuItem>
										<MenuItem value='Non-VAT Registered'>Non-VAT</MenuItem>
									</Select>
								</FormControl>
							</Grid>

							{/* Quoted Price VAT Status */}
							<Grid item xs={12} sm={4}>
								<FormControl fullWidth variant='outlined'>
									<InputLabel>Quoted Price VAT Status</InputLabel>
									<Select
										value={vendorDetails.quotedVatStatus}
										name='quotedVatStatus'
										onChange={handleVendorDetailsChange}
										label='Quoted Price VAT Status'>
										<MenuItem value='VATInc'>VATInc</MenuItem>
										<MenuItem value='VATEx'>VATEx</MenuItem>
									</Select>
								</FormControl>
							</Grid>

							{/* EW Rate */}
							<Grid item xs={12} sm={4}>
								<TextField
									fullWidth
									label='EW Rate'
									value={vendorDetails.ewRate}
									onChange={handleVendorDetailsChange}
									variant='outlined'
									name='ewRate'
								/>
							</Grid>

							{/* Order Discount */}
							<Grid item xs={12}>
								<Typography variant='button'>Order Discount</Typography>
							</Grid>

							{/* Discount Applied On */}
							<Grid item xs={12} sm={4}>
								<FormControl fullWidth variant='outlined'>
									<InputLabel>Discount applied on</InputLabel>
									<Select
										onChange={handleVendorDetailsChange}
										value={vendorDetails.orderDiscountAppliedOn}
										name='orderDiscountAppliedOn'
										label='Discount applied on'>
										<MenuItem value='VATInc Price'>VATInc Price</MenuItem>
										<MenuItem value='VATEx Price'>VATEx Price</MenuItem>
									</Select>
								</FormControl>
							</Grid>

							{/* Rate of Cost Discount */}
							<Grid item xs={12} sm={4}>
								<TextField
									fullWidth
									label='% of Cost discount'
									value={vendorDetails.rateOfCostDiscount}
									onChange={handleVendorDetailsChange}
									variant='outlined'
									name='rateOfCostDiscount'
								/>
							</Grid>

							{/* Discounted On */}
							<Grid item xs={12} sm={4}>
								<FormControl fullWidth variant='outlined'>
									<InputLabel>Discounted on</InputLabel>
									<Select
										onChange={handleVendorDetailsChange}
										value={vendorDetails.orderDiscountedOn}
										name='orderDiscountedOn'
										label='Discounted on'>
										<MenuItem value='Total Cost'>Total Cost</MenuItem>
										<MenuItem value='Material Cost'>Material Cost</MenuItem>
										<MenuItem value='L&E Cost'>L&E Cost</MenuItem>
									</Select>
								</FormControl>
							</Grid>

							{/* Fixed Amount */}
							<Grid item xs={12} sm={4}>
								<TextField
									fullWidth
									label='Fixed Amount'
									value={vendorDetails.fixedAmount}
									onChange={handleVendorDetailsChange}
									variant='outlined'
									name='fixedAmount'
								/>
							</Grid>

							{/* Fixed Amount  */}
							<Grid item xs={12} sm={4}>
								<FormControl fullWidth variant='outlined'>
									<InputLabel>Discounted on</InputLabel>
									<Select
										onChange={handleVendorDetailsChange}
										value={vendorDetails.fixedAmountDiscountedOn}
										name='fixedAmountDiscountedOn'
										label='Discounted on'>
										<MenuItem value='Material Cost'>Material Cost</MenuItem>
										<MenuItem value='L&E Cost'>L&E Cost</MenuItem>
									</Select>
								</FormControl>
							</Grid>
						</Grid>
						<Divider style={{ marginTop: 20, marginBottom: 20 }} />
						<Typography gutterBottom>Computation</Typography>

						{/* Computation */}
						<Grid container spacing={1}>
							{/* Column Names */}
							<Grid item xs={3} />
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='button' gutterBottom>
									Material Cost
								</Typography>
							</Grid>
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='button' gutterBottom>
									Labor Cost
								</Typography>
							</Grid>
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='button' gutterBottom>
									Total Cost
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<Divider />
							</Grid>

							{/* Total Cost(VATInc) */}
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>Total Cost(VATInc)</Typography>
							</Grid>
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>
									{checkVatStatus(vendorDetails.totalMaterialCost)}
								</Typography>
							</Grid>
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>
									{checkVatStatus(vendorDetails.totalLaborCost)}
								</Typography>
							</Grid>
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>
									{checkVatStatus(vendorDetails.totalCost)}
								</Typography>
							</Grid>

							{/* Less: Order Discount Applied on VATInc */}
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>
									Less: Order Discount Applied on VATInc
								</Typography>
							</Grid>
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>
									{checkOrderDiscount(
										vendorDetails.totalMaterialCost,
										"Material Cost"
									)}
								</Typography>
							</Grid>
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>
									{checkOrderDiscount(vendorDetails.totalLaborCost, "L&E Cost")}
								</Typography>
							</Grid>
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>
									{totals["OrderDiscountAppliedOnVATIncTotal"] === 0
										? "---"
										: totals["OrderDiscountAppliedOnVATIncTotal"]}
								</Typography>
							</Grid>

							{/* Less: VAT */}
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>Less: VAT</Typography>
							</Grid>
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>
									{checkLessVat(
										vendorDetails.totalMaterialCost,
										totals["OrderDiscountAppliedOnVATIncMC"],
										"Material Cost"
									)}
								</Typography>
							</Grid>
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>
									{checkLessVat(
										vendorDetails.totalLaborCost,
										totals["OrderDiscountAppliedOnVATIncLC"],
										"LC"
									)}
								</Typography>
							</Grid>
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>
									{vats["lessVATtotal"] === 0 ? "---" : vats["lessVATtotal"]}
								</Typography>
							</Grid>

							<Grid item xs={12}>
								<Divider />
							</Grid>

							{/* Total Amount (VATEx) */}
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>Total Amount (VATEx)</Typography>
							</Grid>
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>
									{computeVatEx("Material Cost")}
								</Typography>
							</Grid>
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>
									{computeVatEx("Labor Cost")}
								</Typography>
							</Grid>
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>
									{parseFloat(vatex["VATExTotal"]).toFixed(2)}
								</Typography>
							</Grid>

							{/* Less: Order Discount Applied on VATEx */}
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>
									Less: Order Discount Applied on VATEx
								</Typography>
							</Grid>
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>
									{vatexDiscount("Material Cost")}
								</Typography>
							</Grid>
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>
									{vatexDiscount("L&E Cost")}
								</Typography>
							</Grid>
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>
									{parseFloat(vatexDiscounts["VATExDiscountTotal"]).toFixed(2)}
								</Typography>
							</Grid>

							{/* Discounted Total Cost (VATEx) */}
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>
									Discounted Total Cost (VATEx)
								</Typography>
							</Grid>
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>
									{discountTotalCost("Material Cost")}
								</Typography>
							</Grid>
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>
									{discountTotalCost("L&E Cost")}
								</Typography>
							</Grid>
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>
									{parseFloat(discountedTotalCosts["total"]).toFixed(2)}
								</Typography>
							</Grid>

							{/* Add: VAT */}
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>Add: VAT</Typography>
							</Grid>
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>
									{addVatTotal("Material Cost")}
								</Typography>
							</Grid>
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>
									{addVatTotal("L&E Cost")}
								</Typography>
							</Grid>
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>
									{parseFloat(addVat["total"]).toFixed(2)}
								</Typography>
							</Grid>

							{/* Less: EWT */}
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>Less: EWT</Typography>
							</Grid>
							<Grid item xs={3} className={classes.rightAlignedColumn} />
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>
									{parseFloat(
										discountedTotalCosts["LC"] / vendorDetails.ewRate
									).toFixed(2)}
								</Typography>
							</Grid>
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>
									{parseFloat(
										discountedTotalCosts["LC"] / vendorDetails.ewRate
									).toFixed(2)}
								</Typography>
							</Grid>

							{/* Add: Shipment / Delivery Cost */}
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>
									Add: Shipment / Delivery Cost
								</Typography>
							</Grid>
							<Grid item xs={3} className={classes.rightAlignedColumn} />
							<Grid item xs={3} className={classes.rightAlignedColumn} />
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='body2'>{shipmentcost}</Typography>
							</Grid>

							<Grid item xs={12}>
								<Divider />
							</Grid>

							{/* NET TOTAL AMOUNT PAYABLE */}
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='h6'>NET TOTAL AMOUNT PAYABLE</Typography>
							</Grid>
							<Grid item xs={3} className={classes.rightAlignedColumn} />
							<Grid item xs={3} className={classes.rightAlignedColumn} />
							<Grid item xs={3} className={classes.rightAlignedColumn}>
								<Typography variant='h6'>{totalAmountPayable()}</Typography>
							</Grid>
						</Grid>
					</Paper>
				</div>
			</Container>
		</div>
	);
}

export default Home;
