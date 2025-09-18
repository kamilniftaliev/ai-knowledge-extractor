import { ERROR_MESSAGE } from "@/constants";
import { extractKnowledge } from "@/utils/ai";

import { AiResponse, ErrorResponse } from "@/types";
import { supabase } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get("searchTerm");
  const sentiment = searchParams.get("sentiment");

  let response = [];

  try {
    let query = supabase.from("knowledge").select();

    if (searchTerm) {
      query = query.ilike("summary", `%${searchTerm}%`);
    }

    if (sentiment) {
      query = query.eq("sentiment", sentiment);
    }

    const { data, error } = await query;

    if (error) {
      response = [
        {
          error: `DB Error: ${error.message}`,
        },
      ];
    } else {
      response = data;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      response = [
        {
          error: error.message || ERROR_MESSAGE,
        },
      ];
    }
  }

  return NextResponse.json(response);
}

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  let response = {} as AiResponse | ErrorResponse;

  try {
    response = await extractKnowledge(text);

    if (!response.error) {
      const { data, error } = await supabase
        .from("knowledge")
        .insert(response)
        .select();

      if (error) {
        response = {
          error: `DB Error: ${error.message}`,
        };
      } else {
        response = {
          ...response,
          ...data[0],
        };
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      response = {
        error: error.message || ERROR_MESSAGE,
      };
    }
  }

  return NextResponse.json(response);
}
