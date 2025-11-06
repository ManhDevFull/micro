import axios from "axios";
import { useEffect, useState } from "react";

export default function CategoryComponent() {
  const menu = [
    {
      key: "groceries",
      name: "Groceries",
      children: [],
    },
    {
      key: "premiumFruits",
      name: "Premium Fruits",
      children: [],
    },
    {
      key: "home&Kitchen",
      name: "Home & Kitchen",
      children: [],
    },
    {
      key: "fashion",
      name: "Fashion",
      children: [],
    },
    {
      key: "electronics",
      name: "Electronics",
      children: [],
    },
    {
      key: "beauty",
      name: "Beauty",
      children: [],
    },
    {
      key: "homeImprovement",
      name: "Home Improvement",
      children: [],
    },
    {
      key: "sports&Toys&Luggape",
      name: "Sports, Toys & Luggape",
      children: [],
    },
  ];
  type Category = {
    _id: number;
    name_category: string;
  }
  const [categoryParent, setcategoryParent] = useState<Category[]>([]);
  useEffect(()=>{
    const fetchData = async() =>{
      try{
        const res = await axios.get('http://localhost:5000/category/parent');
        console.log('data respon: ', res.data);
        setcategoryParent(res.data);
      }
      catch{
        console.log("failded for call categoryParent");
      }
    }
    fetchData();
  }, []);
      console.log('hello bạn', categoryParent );
  return (
    <>
      <ul className="hidden p-2 xl:px-10 pt-4 pb-3 xl:grid xl:grid-cols-4 2xl:flex justify-evenly w-full shadow-md">
      {categoryParent.map((item, index) => (
        <li
          key={item._id}
          className={`rounded-full flex max-w-[90%] 2xl:mt-0 px-3 2xl:px-6 py-2 justify-evenly items-center bg-gray-100 hover:bg-black hover:text-white duration-500 drop-shadow-sm ${
            index > 3 ? "xl:mt-2" : ""
          }`}
        >
              <span>{item.name_category}</span>
              <svg
                style={{ marginLeft: "7px" }}
                width="19"
                height="19"
                viewBox="0 0 19 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.4053 6.375L9.15527 11.625L3.90527 6.375"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </li>
          ))}
      </ul>
    </>
  );
}
