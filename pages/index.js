import Collection from "@/components/Collection";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import { mongooseconnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";


export default function Home({ featuredProduct, newProducts, collectionProduct }) {
  return <>
    <Hero product={featuredProduct} />


    <hr class="my-4 h-px border-0 bg-gray-300" />

    <Products products={newProducts} />
    <hr class="my-4 h-px border-0 bg-gray-300" />

    <Collection product={collectionProduct} />

  </>
}


export async function getServerSideProps() {
  await mongooseconnect();

  const featuredId = '687d9dc349600dbdb138ea4f'
  const collectionId = '687d9f4b49600dbdb138ea82'

  const featuredProduct = await Product.findById(featuredId);
  const collectionProduct = await Product.findById(collectionId);
  const newProducts = await Product.find({}, null, {sort: {'_id':1}, limit: 5})

  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      collectionProduct: JSON.parse(JSON.stringify(collectionProduct)),
    }

  }
}