"use client";

import { flex } from "styled-system/patterns";
import { Flex, HStack, Square } from "styled-system/jsx";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useCounterStore } from "@/providers/counter-store-provider";

export function Card() {
  const { count, incrementCount, decrementCount, reset } = useCounterStore(
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
        <Text fontWeight="bold" fontSize="xl">
          Counter
        </Text>
      </div>
      <Flex alignItems="center" justifyContent="center" flexGrow={1}>
        <Text fontSize="8xl" fontFamily="monospace">
          {count}
        </Text>
      </Flex>
      <HStack gap={2}>
        <Button size="xl" onClick={incrementCount}>
          +
        </Button>
        <Button
          variant="outline"
          size="xl"
          disabled={count === 0}
          onClick={decrementCount}
        >
          -
        </Button>
        <Button
          size="xl"
          variant="ghost"
          disabled={count === 0}
          onClick={reset}
        >
          Reset
        </Button>
      </HStack>
    </Square>
  );
}
