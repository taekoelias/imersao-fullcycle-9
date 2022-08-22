import { AppBar, Toolbar, Button, Typography } from "@material-ui/core";
import Link from "next/link";
import StoreIcon from "@material-ui/icons/Store";

export const Navbar: React.FunctionComponent = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Link href={"/"} as={`/`} passHref>
          <Button color="inherit" startIcon={<StoreIcon />} component="a">
            <Typography variant="h6">Code Store</Typography>
          </Button>
        </Link>
      </Toolbar>
    </AppBar>
  )
}