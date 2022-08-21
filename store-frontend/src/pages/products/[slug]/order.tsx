import { Typography, ListItem, ListItemAvatar, Avatar, ListItemText, Grid, TextField, Box, Button } from "@material-ui/core";
import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { Head } from "next/document";
import { http } from "../../../libs/http";
import { Product } from "../../../model/product";

interface OrderPageProps {
  product: Product;
}

const OrderPage: NextPage<OrderPageProps> = ({ product }) => {
  return (
    <div>
      <Head>
        <title>Payment</title>
      </Head>
      <Typography component="h1" variant="h3" color="textPrimary" gutterBottom>
        Checkout
      </Typography>
      <ListItem>
        <ListItemAvatar>
          <Avatar src={product.image_url} />
        </ListItemAvatar>
        <ListItemText
          primary={product.name}
          secondary={`$ ${product.price.toPrecision(2)}`}
        />
      </ListItem>
      <Typography component="h2" variant="h6" gutterBottom>
        Pay with credit card
      </Typography>
      <form >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField required label="Name" fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Credit card number"
              required
              fullWidth
              inputProps={{ maxLength: 16 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              type="number"
              label="CVV"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  required
                  type="number"
                  label="Expiration month"
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  type="number"
                  label="Expiration year"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box marginTop={1}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Pay
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default OrderPage;

export const getServerSideProps: GetServerSideProps<
  OrderPageProps,
  { slug: string }
> = async (context) => {
  const { slug } = context.params!;
  try {
    const { data: product } = await http.get(`products/${slug}`);

    console.log(product);

    return {
      props: {
        product,
      },
    };
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      return { notFound: true };
    }
    throw e;
  }
};