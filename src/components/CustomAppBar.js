import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

function CustomAppBar() {
	return (
		<AppBar position='static'>
			<Toolbar variant='dense'>
				<Typography variant='h6'>VAT Calculator</Typography>
			</Toolbar>
		</AppBar>
	);
}

export default CustomAppBar;
