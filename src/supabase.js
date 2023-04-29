import {createClient} from "@supabase/supabase-js";
import * as dotenv from 'dotenv'
dotenv.config();

const TABLE = 'products'

const formatDate = (d) => {
    // if (!date) return "";
    const date = d;
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const getProductList = async () => {
    const date = new Date();

    const resp = await supabase
        .from(TABLE)
        .select()
        .order("id", { ascending: true })
        .filter("date", "gte", formatDate(date));

    return resp.data;
}

export const setProduct = async (arg) => {
    const resp = await supabase.from(TABLE).insert([arg]);

    return { ...resp };
};

export const updateStatusProduct = async (arg) => {
    const resp = await supabase.from(TABLE).upsert([arg]);

    return resp;
};

export const deleteProduct = async (id) => {
    const resp = await supabase.from(TABLE).delete().eq("id", id);

    return { ...resp };
};

export const editProduct = async (arg) => {
    const resp = await supabase
        .from(TABLE)
        .update([arg])
        .eq("id", arg.id);

    return { ...resp };
};

