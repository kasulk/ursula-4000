import { cache } from "react";
import dbConnect from "@/db/connect";
import { Overview, Quote, Logourl, User, Like } from "@/db/models";
import {
  IOverviewData,
  IUser,
  IUserWithPassword,
  IStock,
  IQuoteData,
  ILogoData,
} from "@/../types/types";

const dataFilterOverviews = [
  "id",
  "ticker",
  "name",
  "description",
  "exchange",
  "sector",
  "industry",
  "marketCapitalization",
  "dividendPerShare",
  "dividendYield",
  "analystTargetPrice",
  "eps",
  "eps15x",
  "bookValue",
  "priceToBookRatio",
  "fiftyTwoWeekHigh",
  "fiftyTwoWeekLow",
  "updatedAt",

  "country",
];

/// FETCH DATA WITH API
export async function getStockOverviewsFromAPI(): Promise<IStock[]> {
  const res = await fetch("http://localhost:3000/api/stocks", {
    next: { revalidate: 3600 },
  });
  console.log("Overviews have been fetched from API.");
  return res.json();
}

/// FETCH DATA WITHOUT API
// export const revalidate = 3600; /// set revalidation time for cached stocks
export const revalidate = 1; /// set revalidation time for cached stocks

export async function getStocksFromDB(): Promise<IStock[]> {
  dbConnect();
  const stocksData = [
    await Overview.find().select(dataFilterOverviews).sort({ ticker: 1 }),
    await Quote.find(),
    await Logourl.find(),
  ].map((dataset) => mongoDocsToPlainObjs(dataset));

  const [overviews, quotesData, logosData] = stocksData as [
    IOverviewData[],
    IQuoteData[],
    ILogoData[],
  ];

  const mergedData = overviews.map((overview) => {
    const quotes =
      quotesData.find((data) => data.ticker === overview.ticker) || null;

    delete quotes?.id;

    const logoURL =
      logosData.find((data) => data.ticker === overview.ticker)?.logoURL ||
      null;

    return {
      ...overview,
      quotes,
      logoURL,
    };
  });

  return mergedData as IStock[];
}

/// Only plain objects can be passed from Server Components
/// to Client Components
export function mongoDocToPlainObj(document: any): Object {
  const { _id, __v, ...rest } = document.toObject();
  const plainObject = { id: _id.toString(), ...rest };
  return plainObject;
}

export function mongoDocsToPlainObjs(documents: any[]): Object[] {
  const plainObjects = documents.map((doc) => mongoDocToPlainObj(doc));
  return plainObjects;
}

export function removePasswordFromUser(user: IUserWithPassword): IUser {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export function createUsername(): string {
  const randomNumStr = Math.floor(Math.random() * 100000).toString();
  return "ursula" + randomNumStr;
}

export function createUsernameFromEmail(email?: string | null): string {
  const randomNumStr = Math.floor(Math.random() * 10000).toString();
  if (!email) return "ursula" + randomNumStr;
  if (email.length > 30) {
    const [local] = email.split("@");
    return local.slice(0, 26) + randomNumStr;
  }
  return email;
}

type Ticker = string;

export async function getLikedStocksByUser(userId: any): Promise<Ticker[]> {
  dbConnect();
  const userLikes = await Like.find({ userId }).lean();
  const likedTickers = userLikes.map((like) => like.ticker); // ['AMD', 'MCD' ...]

  return likedTickers;
}
