import { Typography, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, Grid, TextField, Box, Button, List } from "@material-ui/core";
import axios from "axios";
import { GetServerSideProps, NextPage } from "next"
import Head from "next/head";
import React, { FormEvent, useState } from "react";
import { http } from "../../libs/http";
import { Product } from "../../model/product";

interface ProductDto {
  name: string,
  price: number,
  description: string,
  image_url: string
}

interface AdminPageProps {
  products: Product[];
}

const AdminPage : NextPage<AdminPageProps> = ({products}) => {
  const defaultProduct = {name: "", price: 0.0, description: "", image_url: ""} as ProductDto;
  const productsList= products;

  const [dto, setDto] = useState<ProductDto>(defaultProduct)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { data: product } = await http.post("products", {
        ...dto
      });
     productsList.push(product);
     setDto(defaultProduct);
    } catch (e) {
      console.error(axios.isAxiosError(e) ? e.response?.data : e);
    }
  };

  return (
    <div>
      <Head>
        <title>Products</title>
      </Head>
      <Typography component="h1" variant="h3" color="textPrimary" gutterBottom>
        Create products
      </Typography>
      <form onSubmit={onSubmit}>
        <Grid container spacing={3} style={{paddingBottom: 10}}>
          <Grid item xs={12} md={6}>
            <TextField 
              required 
              label="Name" 
              fullWidth 
              value={dto.name}
              onChange={(e)=> setDto({...dto, name: e.target.value})}/>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Price"
              type="number"
              required
              fullWidth
              value={dto.price}
              onChange={(e)=> setDto({...dto, price: parseFloat(e.target.value)})}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              required
              label="Image URL"
              fullWidth
              value={dto.image_url}
              onChange={(e)=> setDto({...dto, image_url: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              required
              label="Description"
              fullWidth
              value={dto.description}
              onChange={(e)=> setDto({...dto, description: e.target.value})}
            />
          </Grid>
        </Grid>
        <Box marginTop={1}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Add
          </Button>
        </Box>
      </form>
      <List style={{ width: '100%', maxWidth: 360 }}>
        {productsList && productsList.map((product) => (
          <div key={product.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt={product.name} src={product.image_url} />
              </ListItemAvatar>
              <ListItemText
                primary={product.name}
                secondary={`$ ${product.price}`}
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </div>
        ))}
      </List>
    </div>
  )
}

export default AdminPage

export const getServerSideProps: GetServerSideProps<AdminPageProps> = async (context) => {
  
  const { data: products} = await http.get<Product[]>('products')

  return {
    props: {
      products
    }
  }
}