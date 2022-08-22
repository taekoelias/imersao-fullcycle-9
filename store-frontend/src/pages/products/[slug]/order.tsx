import { Typography, ListItem, ListItemAvatar, Avatar, ListItemText, Grid, TextField, Box, Button } from "@material-ui/core";
import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import router from "next/router";
import { useForm } from "react-hook-form";
import { http } from "../../../libs/http";
import { CreditCard } from "../../../model/credit-card";
import { Order } from "../../../model/order";
import { Product } from "../../../model/product";

interface OrderPageProps {
  product: Product;
}

const OrderPage: NextPage<OrderPageProps> = ({ product }) => {
  
  const {register, handleSubmit, setValue} = useForm<CreditCard>()
  
  const onSubmit = async (data: CreditCard) => {
    try {
      const { data: order } = await http.post<Order>("orders", {
        credit_card: {...data, expiration_month: parseInt(data.expiration_month.toString()), expiration_year: parseInt(data.expiration_year.toString())},
        items: [{ product_id: product.id, quantity: 1 }],
      });
      router.push(`/orders/${order.id}`);
    } catch (e) {
      console.error(axios.isAxiosError(e) ? e.response?.data : e);
    }
  }

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField 
              required 
              label="Name" 
              fullWidth 
              {...register("name")}/>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Credit card number"
              required
              fullWidth
              inputProps={{ maxLength: 16 }}
              {...register("number")}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              type="number"
              label="CVV"
              fullWidth
              {...register("cvv")}
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
                  {...register("expiration_month")}
                  onChange={(e) =>
                    setValue("expiration_month", parseInt(e.target.value))
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  type="number"
                  label="Expiration year"
                  fullWidth
                  {...register("expiration_year")}
                  onChange={(e) =>
                    setValue("expiration_year", parseInt(e.target.value))
                  }
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box marginTop={3}>
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