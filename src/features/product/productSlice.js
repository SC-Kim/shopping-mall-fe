import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

// 비동기 액션 생성
export const getProductList = createAsyncThunk(
  "products/getProductList",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get("/product", {params: {...query}});
      if (response.status !== 200) throw new Error(response.error)

      console.log("rrrr? ", response)
      return response.data
    } catch (error) {
      rejectWithValue(error.error)
    }
  }
);

export const getProductDetail = createAsyncThunk(
  "products/getProductDetail",
  async (id, { rejectWithValue }) => { }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/product", formData)
      if (response.status !== 200) throw new Error(response.error)

      dispatch(showToastMessage({ message: "상품 생성 완료", status: "success" }))
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.error)
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { dispatch, rejectWithValue }) => { }
);

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, ...formData }, { dispatch, rejectWithValue }) => { }
);

// 슬라이스 생성
const productSlice = createSlice({
  name: "products",
  initialState: {
    productList: [],
    selectedProduct: null,
    loading: false,
    error: "",
    totalPageNum: 1,
    success: false,
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setFilteredList: (state, action) => {
      state.filteredList = action.payload;
    },
    clearError: (state) => {
      state.error = "";
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createProduct.pending, (state, action) => {
      state.loading = true;
    })
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.success = true; //상품 생성을 성공하면? 다이얼로그르 닫고, 실패하면? 실패 메시지를 다이얼로그에 보여주고, 닫진 않음. 

    })
    builder.addCase(createProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    })
    builder.addCase(getProductList.pending, (state, action) => {
      state.loading = true;
    })
    builder.addCase(getProductList.fulfilled, (state, action) => {
      state.loading = false;
      state.productList = action.payload.data;
      state.error = ""
      state.totalPageNum = action.payload.totalPageNum;
    })
    builder.addCase(getProductList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
  },
});

export const { setSelectedProduct, setFilteredList, clearError } =
  productSlice.actions;
export default productSlice.reducer;
