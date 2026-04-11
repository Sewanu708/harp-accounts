import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";

const BASE_URL = process.env.HARP_BASE;

async function handleProxyRequest(request: NextRequest) {
  const session = await getServerSession(authOptions);

  const path =
    (request.nextUrl.pathname.match(/api\/proxy\/(.*)/) || [])[1] || "";
  const search = request.nextUrl.search;

  const baseUrl = BASE_URL?.endsWith("/") ? BASE_URL : `${BASE_URL}/`;
  const backendPath = `${baseUrl}${path}${search}`;

  console.log('This is backend path', backendPath,session?.token)
  const headers: Record<string, any> = {
    ...request.headers,
    Authorization: session?.token ?? "",
  };

  let body = null;
  if (
    request.method === "POST" ||
    request.method === "PUT" ||
    request.method === "PATCH"
  ) {
    try {
      body = await request.json();
    } catch (e: unknown) {
      body = undefined;
      console.error(e);
    }
  }

  const config: AxiosRequestConfig = {
    method: request.method,
    url: backendPath,
    headers,
    data: body,
  };

  // console.log(config);

  try {
    const response = await axios(config);
    // console.log(response.data);
    return NextResponse.json(response.data);
  } catch (error) {
    // console.log(error);
    if (error instanceof AxiosError) {
      return NextResponse.json(
        error.response?.data || { message: error.message },
        {
          status: error.response?.status || 500,
        }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json(
      { message: "Error processing request", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // console.log("This is GET Request");
  return handleProxyRequest(req);
}

export async function POST(req: NextRequest) {
  return handleProxyRequest(req);
}

export async function PUT(req: NextRequest) {
  return handleProxyRequest(req);
}

export async function DELETE(req: NextRequest) {
  return handleProxyRequest(req);
}

export async function PATCH(req: NextRequest) {
  return handleProxyRequest(req);
}
