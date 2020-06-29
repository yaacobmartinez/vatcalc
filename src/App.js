import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";
import Home from "./components/Home";
const theme = createMuiTheme({
	typography: {
		fontFamily: [
			"Poppins",
			"-apple-system",
			"BlinkMacSystemFont",
			'"Segoe UI"',
			"Roboto",
			'"Helvetica Neue"',
			"Arial",
			"sans-serif",
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(","),
	},
});

function App() {
	return (
		<div>
			<Router>
				<ThemeProvider theme={theme}>
					<Switch>
						<Route exact path='/' component={Home} />
					</Switch>
				</ThemeProvider>
			</Router>
		</div>
	);
}

export default App;
