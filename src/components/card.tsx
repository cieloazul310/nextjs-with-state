"use client";

// import { css } from "styled-system/css";
import { flex } from "styled-system/patterns";
import { Flex, HStack, Square } from "styled-system/jsx";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useCounterStore } from "@/providers/counter-store-provider";

export function Card() {
  const { count, incrementCount, decrementCount } = useCounterStore(
    (store) => store,
  );
  return (
    <Square
      size="360px"
      className={flex({
        direction: "column",
        bg: "bg.canvas",
        rounded: "xl",
        shadow: "xl",
        p: 8,
      })}
    >
      <div>
        <Text fontWeight="bold" fontFamily="monospace">
          Counter
        </Text>
      </div>
      <Flex alignItems="center" justifyContent="center" flexGrow={1}>
        <Text fontSize="8xl">{count}</Text>
      </Flex>
      <HStack gap={2}>
        <Button colorPalette="accent" onClick={incrementCount}>
          Increment
        </Button>
        <Button variant="ghost" onClick={decrementCount}>
          Decrement
        </Button>
      </HStack>
    </Square>
  );
}
