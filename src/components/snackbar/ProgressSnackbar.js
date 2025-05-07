import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "./ProgressSnackbar.css"
const ProgressSnackbar = (props) => {
	const [woToast, setWoToast] = React.useState(null);
	const [inventoryToast, setInventoryToast] = React.useState(null);
	const [invBalToast, setInvBalToast] = React.useState(null);
	const [prToast, setPrToast] = React.useState(null);
	const [poToast, setPoToast] = React.useState(null);
	const [assetToast, setAssetToast] = React.useState(null);


	useEffect(() => {
		const wtoast = toast.loading('Loading Work Order Data...');
		setWoToast(wtoast);

		const itoast = toast.loading('Loading Inventory Data...');
		setInventoryToast(itoast);

		const ibtoast = toast.loading('Loading Inventory Balance Data...');
		setInvBalToast(ibtoast);

		const prtoast = toast.loading('Loading Purchase Request Data...');
		setPrToast(prtoast);

		const potoast = toast.loading('Loading Purchase Order Data...');
		setPoToast(potoast);

		const atoast = toast.loading('Loading Asset Data...');
		setAssetToast(atoast);
	}, []);

	useEffect(() => {
		if (!props.loading.woData) {
			toast.update(woToast, { render: "Work Order Data Loaded", type: "success", isLoading: false, closeButton: faTimes, autoClose: props.closeTimeout });
		}
		if (!props.loading.inventoryData) {
			toast.update(inventoryToast, { render: "Inventory Data Loaded", type: "success", isLoading: false, closeButton: faTimes, autoClose: props.closeTimeout });
		}
		if (!props.loading.invBalData) {
			toast.update(invBalToast, { render: "Inventory Balance Data Loaded", type: "success", isLoading: false, closeButton: faTimes, autoClose: props.closeTimeout });
		}
		if (!props.loading.prData) {
			toast.update(prToast, { render: "Purchase Request Data Loaded", type: "success", isLoading: false, closeButton: faTimes, autoClose: props.closeTimeout });
		}
		if (!props.loading.poData) {
			toast.update(poToast, { render: "Purchase Order Data Loaded", type: "success", isLoading: false, closeButton: faTimes, autoClose: props.closeTimeout });
		}
		if (!props.loading.assetData) {
			toast.update(assetToast, { render: "Asset Data Loaded", type: "success", isLoading: false, closeButton: faTimes, autoClose: props.closeTimeout });
		}
	}, [props.loading, woToast, inventoryToast, invBalToast, prToast, poToast, assetToast, props.closeTimeout]);

	return (
		<ToastContainer
			pauseOnFocusLoss={false}
			position="bottom-right"
			limit={6}
		/>);
}

export default ProgressSnackbar;