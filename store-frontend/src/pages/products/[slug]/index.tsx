import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@material-ui/core";
import axios from "axios";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { http } from "../../../libs/http";
import { Product } from "../../../model/product";

interface ProductDetailPageProps {
  product: Product;
}

const ProductDetailPage: NextPage<ProductDetailPageProps> = ({product}: ProductDetailPageProps) => {
  return (
    <div>
      <Head>
        <title>{product.name} - Details</title>
      </Head>
      <Card>
        <CardHeader
          title={product.name.toUpperCase()}
          subheader={`$ ${product.price.toPrecision(2)}`}
          />
        <CardActions>
          <Link
            href="/products/[slug]/order"
            as={`/products/${product.slug}/order`}
            passHref
          >
            <Button size="small" color="primary" component="a">
              Buy
            </Button>
          </Link>
        </CardActions>
        <CardMedia style={{ paddingTop: "56%" }} image={product.image_url} />
        <CardContent>
          <Typography component="p" variant="body2" color="textSecondary" gutterBottom>
            {product.description}
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProductDetailPage;

export const getStaticProps: GetStaticProps<ProductDetailPageProps> = async (context) => {
  const {slug} = context.params!;
  try {
    const {data: product} = await http.get<Product>(`products/${slug}`)
    return {
      props: {
        product
      },
      revalidate: 5 * 60 // 5 minutes
    }
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return {notFound: true}
    }
    throw err
  }

}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const { data: products} = await http.get<Product[]>('products')
  const paths = products.map((product) => ({params: {slug: product.slug}}));
  return {
    paths,
    fallback: 'blocking'
  }
}