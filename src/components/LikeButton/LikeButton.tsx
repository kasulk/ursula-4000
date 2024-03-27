"use client";

import { Checkbox } from "@nextui-org/checkbox";
import { useState } from "react";
import { HeartIcon } from "../Icons";
import { useSession } from "next-auth/react";
import * as actions from "@/actions";
import { useLikedStocksStore } from "@/store/likesCounter";

interface LikeButtonProps {
  ticker: string;
  isLiked: boolean;
}

export function LikeButton({ ticker, isLiked }: LikeButtonProps) {
  const [liked, setLiked] = useState(isLiked);
  const { data: session } = useSession();
  const userId = session?.user.id;

  const addLikedStock = useLikedStocksStore((state) => state.addLikedStock);
  const removeLikedStock = useLikedStocksStore(
    (state) => state.removeLikedStock,
  );

  async function toggleLike() {
    setLiked(!liked);
    if (session && session.user) {
      if (liked) {
        actions.deleteLike(userId, ticker);
        removeLikedStock(ticker);
      } else {
        actions.createLike(userId, ticker);
        addLikedStock(ticker);
      }
    }
  }

  return (
    <Checkbox
      icon={<HeartIcon />}
      color="danger"
      size="lg"
      radius="full"
      isSelected={liked}
      onValueChange={() => toggleLike()}
    />
  );
}