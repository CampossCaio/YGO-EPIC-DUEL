import Image from "next/image";
import styles from "./styles.module.scss";

// const cardImageLoader = (src: string) => {
//   return `images/cards/${src}`;
// };

export type CardImageProps = {
  src: string;
  width: number;
  height: number;
  quality?: number;
};

const CardPreviewImage = ({
  src,
  width,
  height,
  quality = 75,
}: CardImageProps) => {
  return (
    <Image
      src={`/image/cards/${src}`}
      alt="Picture of the author"
      width={width}
      height={height}
      quality={quality}
    />
  );
};

export type CardProps = {
  handleSelectCard: (card: any) => void;
  card: any;
  onClick: (card: any) => void;
  side: string;
};

export const Card = ({ card, handleSelectCard, onClick, side }: CardProps) => {
  return (
    <div
      onMouseEnter={() => handleSelectCard(card)}
      onMouseLeave={() => handleSelectCard(null)}
      className={`${styles.card}  ${side === "OPPONENT" && styles.opponent}`}
      key={card.id}
      style={{
        background: `center / cover url(${card.image})`,
      }}
      onClick={() => onClick(card)}
    >
      {/* <Image
        src={`/image/cards/kaiba_deck${card.id}`}
        //src={card.image}
        alt="Picture of the author"
        width={80}
        height={120}
        quality={75}
      /> */}
    </div>
  );
};
