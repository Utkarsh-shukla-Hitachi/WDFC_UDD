import React, { Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import "./AppTheme.css";
import DashboardLayout from "./components/layout/DashboardLayout";
import LandingLayout from "./components/layout/LandingLayout";
import NotFoundError from "./components/pages/NotFoundError";
import PrivateRoute from "./helpers/PrivateRoute";

import 'react-toastify/dist/ReactToastify.css';
import {
	getDataFromLocalStorage,
	putDataInLocalStorage,
} from "./components/data/LocalStorageHandler";
import {
	modelAssetData,
	modelInvBalData,
	modelInventoryData,
	modelPOData,
	modelPRData,
	modelWOData
} from './components/data/Models';
import LoadingScreen from "./components/loading/LoadingScreen";
import ProgressSnackbar from "./components/snackbar/ProgressSnackbar";
import { GlobalStates } from "./helpers/GlobalStates";
import useConfig from "./hooks/useConfig";
import useMaximoData from "./hooks/useMaximoData";
import { useKeycloak } from "@react-keycloak/web";

const AssetManagement = React.lazy(() =>
	import("./components/pages/AssetManagement")
);
const IntelligentMonitoring = React.lazy(() =>
	import("./components/pages/IntelligentMonitoring")
);
const InventoryManagement = React.lazy(() =>
	import("./components/pages/InventoryManagement")
);
const WorkManagement = React.lazy(() =>
	import("./components/pages/WorkManagement")
);

function App() {

	const [filter, setFilter] = React.useState({
		startDate: "",
		endDate: "",
		division: [],
		site: [],
		block: [],
		assetClass: [],
		filterMode: "none",
		timespan: "All",
	});

	const { data, loading } = useMaximoData();

	const [dataModels, setDataModels] = React.useState(
		{
			woModel: null,
			inventoryModel: null,
			invBalModel: null,
			prModel: null,
			poModel: null,
			assetModel: null,
		}
	);

	const appConfig = useConfig();

	useEffect(() => {
		if (!loading.woData) {
			const woModel = modelWOData(data.woData, filter);
			setDataModels(prevValue => ({ ...prevValue, woModel: woModel }));
		}
	}, [loading.woData, data.woData, filter]);

	useEffect(() => {
		if (!loading.inventoryData) {
			const inventoryModel = modelInventoryData(data.inventoryData, filter);
			setDataModels(prevValue => ({ ...prevValue, inventoryModel: inventoryModel }));
		}
	}, [loading.inventoryData, data.inventoryData, filter]);

	useEffect(() => {
		if (!loading.invBalData) {
			const invBalModel = modelInvBalData(data.invBalData, filter);
			setDataModels(prevValue => ({ ...prevValue, invBalModel: invBalModel }));
		}
	}, [loading.invBalData, data.invBalData, filter]);

	useEffect(() => {
		if (!loading.prData) {
			const prModel = modelPRData(data.prData, filter);
			setDataModels(prevValue => ({ ...prevValue, prModel: prModel }));
		}
	}, [loading.prData, data.prData, filter]);

	useEffect(() => {
		if (!loading.poData) {
			const poModel = modelPOData(data.poData, filter);
			setDataModels(prevValue => ({ ...prevValue, poModel: poModel }));
		}
	}, [loading.poData, data.poData, filter]);

	useEffect(() => {
		if (!loading.assetData) {
			const assetModel = modelAssetData(data.assetData, filter);
			setDataModels(prevValue => ({ ...prevValue, assetModel: assetModel }));
		}
	}, [loading.assetData, data.assetData, filter]);

	//------------ THEMING ----------------
	const [currentTheme, setCurrentTheme] = React.useState("light");
	const [themeLoaded, setThemeLoaded] = React.useState(false);

	useEffect(() => {
		if (!appConfig?.THEMING_ENABLED) return;
		const savedTheme = getDataFromLocalStorage("user-theme");
		if (savedTheme) {
			setCurrentTheme(savedTheme);
		}
		setThemeLoaded(true);
	}, [appConfig]);

	useEffect(() => {
		if (!appConfig?.THEMING_ENABLED) return;
		if (!themeLoaded) return;
		putDataInLocalStorage(currentTheme, "user-theme");
	}, [currentTheme, themeLoaded, appConfig?.THEMING_ENABLED]);
	//-------------------------------------
	const globalStateData = {
		filterState: {
			filter: filter,
			setFilter: setFilter,
		},
		dataModelsState: {
			dataModels: dataModels,
			setDataModels: setDataModels,
		},

		dataLoadState: {
			isLoading: loading,
		},
		appConfig: appConfig,
		theme: {
			currentTheme: currentTheme,
			setCurrentTheme: setCurrentTheme,
		},
	};

	const {keycloak} = useKeycloak();


	return (
		<GlobalStates.Provider value={globalStateData}>
			<div className="App" data-bs-theme={currentTheme}>
			{keycloak.authenticated && <ProgressSnackbar loading={loading} closeTimeout={3000} />}
				<Suspense fallback={<LoadingScreen isLoading={true} />}>

					<Routes>
						<Route path="/" element={<Navigate to="/work" />} />

						<Route
							path="/work"
							element={
								<PrivateRoute redirectto={"/work"}>
									<DashboardLayout>
										<WorkManagement />
									</DashboardLayout>
								</PrivateRoute>
							}
						/>
						<Route
							path="/asset"
							element={
								<PrivateRoute redirectto={"/asset"}>
									<DashboardLayout>
										<AssetManagement />
									</DashboardLayout>
								</PrivateRoute>
							}
						/>
						<Route
							path="/inventory"
							element={
								<PrivateRoute redirectto={"/inventory"}>
									<DashboardLayout>
										<InventoryManagement />
									</DashboardLayout>
								</PrivateRoute>
							}
						/>
						<Route
							path="/intelligent"
							element={
								<PrivateRoute redirectto={"/intelligent"}>
									<DashboardLayout>
										<IntelligentMonitoring />
									</DashboardLayout>
								</PrivateRoute>
							}
						/>

						<Route
							path="*"
							element={
								<LandingLayout>
									<NotFoundError />
								</LandingLayout>
							}
						/>
					</Routes>
				</Suspense>
			</div>
		</GlobalStates.Provider>
	);
}

export default App;
