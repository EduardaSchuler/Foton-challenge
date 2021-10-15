import { ChangeEvent } from "react";
import { FC, useEffect, useRef, useState } from "react";
import SwipeableViews from "react-swipeable-views";
import { useHistory } from "react-router";
import ReactLoading from 'react-loading';
import axios from "axios";

import { Cards } from "../pages/components/Cards";
import { Menu } from "../pages/components/Menu";
import { HeaderSection } from "../pages/components/HeaderSection";
import { Search } from "../pages/components/Search";

import styles from "../styles/Home.module.css";

import { BookData } from "./types/BookData";

export const unknownBookCoverAddress = "https://islandpress.org/sites/default/files/default_book_cover_2015.jpg";

export const Home: FC = () => {
  const userName = "Mehmed AI Fatih";
  const history = useHistory();

  const [CardsBooks, setCardsBooks] = useState<BookData[]>([]);
  const [currentlyReadingBook, setCurrentlyReadingBook] = useState<BookData>();
  const [searchedBooks, setSearchedBooks] = useState<BookData[]>([]);
  const [searchText, setSearchingText] = useState("");
  const [mainIndex, setMiddleIndex] = useState<number>(0);
  const [noResults, setNoResults] = useState(false);
  const [loadMoreButton, setLoadMoreButton] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const searchMainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const CardsQuery = ["Enquanto eu não te encontro", "Here The Whole Time", "Percy Jackson",
      "Pride and Prejudice", "One Last Stop", "The Queen of Nothing"];
    const currentlyReadingBookQuery = "the chalk man";

    setLoading(true);

    axios.all([
      axios.get(`https://www.googleapis.com/books/v1/volumes?q=${CardsQuery[0]}`),
      axios.get(`https://www.googleapis.com/books/v1/volumes?q=${CardsQuery[1]}`),
      axios.get(`https://www.googleapis.com/books/v1/volumes?q=${CardsQuery[2]}`),
      axios.get(`https://www.googleapis.com/books/v1/volumes?q=${CardsQuery[3]}`),
      axios.get(`https://www.googleapis.com/books/v1/volumes?q=${CardsQuery[4]}`),
      axios.get(`https://www.googleapis.com/books/v1/volumes?q=${CardsQuery[5]}`),
    ])
      .then(axios.spread((res1, res2, res3, res4, res5, res6) => {
        setCardsBooks(CardsBooks => [...CardsBooks, res1.data.items[0]]);
        setCardsBooks(CardsBooks => [...CardsBooks, res2.data.items[2]]);
        setCardsBooks(CardsBooks => [...CardsBooks, res3.data.items[0]]);
        setCardsBooks(CardsBooks => [...CardsBooks, res4.data.items[0]]);
        setCardsBooks(CardsBooks => [...CardsBooks, res5.data.items[0]]);
        setCardsBooks(CardsBooks => [...CardsBooks, res6.data.items[0]]);

        setLoading(false);
      }), error => {
        console.error(error);
      });

    axios.get(`https://www.googleapis.com/books/v1/volumes?q=${currentlyReadingBookQuery}`)
      .then(response => {
        setCurrentlyReadingBook(response.data.items[0]);
      }, error => {
        console.error(error);
      })

    if (searchMainRef.current !== null)
      searchMainRef.current.scrollTop = searchMainRef.current.scrollHeight;

    return () => setCardsBooks([]);
  }, []);

  useEffect(() => {
    if (searchText.length > 0) {
      axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchText}&maxResults=40`)
        .then(response => {
          setSearchedBooks(response.data.items !== undefined ? response.data.items : []);
          if (response.data.items === undefined)
            setNoResults(true);
        }, error => {
          console.error(error);
        });
    }

    return () => setSearchedBooks([]);
  }, [searchText]);

  useEffect(() => {
    if (startIndex !== 0) {
      axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchText}&startIndex=${startIndex}&maxResults=40`)
        .then(response => {
          const additionalBooks: BookData[] = response.data.items;
          setSearchedBooks(searchedBooks => [...searchedBooks, ...additionalBooks]);
        }, error => {
          console.error(error);
        });
    }
  }, [startIndex]) 

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchingText(e.target.value);
    setNoResults(false);
  }

  const handleBookClick = (book: BookData) => () => {
    localStorage.setItem("selectedBook", JSON.stringify(book));
    history.push("/book-detail");
  }


  const handleLoadMoreClick = () => {
    setStartIndex(startIndex + 40);
  }

  const round = (number: number) => {
    let string = number.toString();
    let editedNumber = string.slice(0, -1);
    let roundedNumber = editedNumber.concat("0");

    return Number(roundedNumber);
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <ReactLoading type="spin" color="#192c64" height={'5%'} width={'5%'} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.searchAndMenuContainer}>
          <Search
            placeholder="Search book"
            value={searchText}
            onChange={e => handleSearchChange(e)}
          />

          <div className={styles.menu}>
            <p>Home</p>
            <p>Libraries</p>
            <p>Profile</p>
          </div>
        </div>

        {searchText.length === 0 && (
          <div className={styles.welcomeMessage}>
            <p>Hi,&nbsp;</p>
            <p>Mehmed AI Fatih</p>
            <img
              width={24}
              height={24}
              src="hand.png"
              alt="hand"
            />
          </div>
        )}
      </header>

      {searchText.length > 0 ? (
        noResults ? (
          <div>
            <p className={styles.noResultsText}>No results found</p>
          </div>
        ) : (
          <>
            <main
              className={styles.searchMain}
              ref={searchMainRef}
            >
              {searchedBooks.map((book, index) => (
                <div key={index} className={styles.searchedBook}>
                  <img
                    width="100px"
                    height="150px"
                    className={styles.searchedBookCover}
                    src={book.volumeInfo.imageLinks !== undefined ?
                      book.volumeInfo.imageLinks.thumbnail : unknownBookCoverAddress}
                    alt="Book cover"
                    onClick={handleBookClick(book)}
                  />

                  <div className={styles.tooltip}>
                    <p className={styles.title}>
                      {book.volumeInfo.title !== undefined ? book.volumeInfo.title : "Unknown title"}
                    </p>

                    <span className={styles.tooltiptext}>
                      {book.volumeInfo.title !== undefined ? book.volumeInfo.title : "Unknown title"}
                    </span>
                  </div>

                  <div className={styles.tooltip}>
                    <p className={styles.author}>
                      by {book.volumeInfo.authors !== undefined ? book.volumeInfo.authors[0] : "unknown author"}
                    </p>

                    <span className={styles.tooltiptext}>
                      by {book.volumeInfo.authors !== undefined ? book.volumeInfo.authors[0] : "unknown author"}
                    </span>
                  </div>
                </div>
              ))}

              {loadMoreButton && <button
                type="button"
                className={styles.loadMoreButton}
                onClick={handleLoadMoreClick}
              >
                Load more
              </button>}
            </main>
          </>
        )
      ) : (
        <main className={styles.initialMain}>
          <HeaderSection
            sectionLabel="Discover new book"
            linkLabel="More"
            style={{ marginTop: "15px" }}
          >
            <svg className={styles.oval1} width="80" height="127" viewBox="0 0 80 127" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
              <circle cx="63.5" cy="63.5" r="63.5" fill="url(#pattern0)" />
              <defs>
                <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="0.319742" height="0.056425">
                  <use xlinkHref="#image0" transform="scale(0.00940417)" />
                </pattern>
                <image id="image0" width="34" height="6" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAGCAYAAACmekziAAAABGdBTUEAALGOfPtRkwAAAY5JREFUKBW9Uj1IQlEUPuf6pCQofI9+CLMhaynInwyKfrYgGgxRCyEICpyaImh0aomaJKjFagjhUVRDRJNNDv61tLokgRROiZV6T/cFwitsKjpwOYfvnPN9H/deA/xjdM4stTS19W81dw+VN0OBfDwep7o81gt9DofDTByux35bK3afh4BHAPGMgKYByIKElwjswmTCmy9G2p1+G6fqOgHaEPGItbLzp7j68pMJ2+xaU7Hw6AGiVTFTIYQ7JMhKzJgtpGI5wUFml98KvBZBogGGUug5q95qfBrOeHVeaGn77k8jst03LtxuANIkAu4hwwyv8RVEmALAK4Z40ovKdTp9UNFIlBH/KK/VloFgQcxkBLSPxCqCw05IDrHjEMJmIZISvWHGcLerj23fq+q7tv89rBNBM8oOb4IIOhjAjslkiOYTark+aBnzy6VXHgDgQSAcFKJR0ZsTDysJc4dkMB4Xk7GH+rw+a+Sl0ptLkiBXSJ7m9L2GteL0ebU/0bCpA2X3Yo/s9Ia129PBf1Z+AO3ViTcdfWOLAAAAAElFTkSuQmCC" />
              </defs>
            </svg>

            <SwipeableViews
              className={styles.swipeableContainer}
              style={{
                width: "80vw",
                paddingLeft: "20px",
                overflow: "visible",
              }}
              slideStyle={{
                margin: "auto",
                paddingRight: "10px",
                flex: "none",
              }}
            >
              {CardsBooks.map((book, index) => (
                <Cards
                  key={index}
                  showCardsCircle={mainIndex === index ? true : false}
                  onClick={handleBookClick(book)}
                  style={{
                    width: mainIndex === index ? "272px" : "250px",
                    height: mainIndex === index ? "139px" : "128px",
                    padding: mainIndex === index ? "17px 20px 22px 20px" : "14px 15px 15px 15px",
                    background: mainIndex === index ?
                      "#00173D" :
                      "#451475f6"
                  }}
                  titleStyle={{
                    fontSize: index === mainIndex ? "27px" : "25px",
                    lineHeight: index === mainIndex ? "35.99px" : "33.32px",
                  }}
                  authorStyle={{
                    fontSize: index === mainIndex ? "14px" : "12px",
                    lineHeight: index === mainIndex ? "16.41px" : "14.06px",
                    letterSpacing: index === mainIndex ? "1.29px" : "1.1047619581222534px"
                  }}
                  bookName={book.volumeInfo.title !== undefined ? book.volumeInfo.title : "Unknown title"}
                  bookAuthor={book.volumeInfo.authors !== undefined ? book.volumeInfo.authors[0] : "Unknown author"}
                  pageCount={index === 0 ? 120 : (
                    index === 1 ? 90 : (
                      book.volumeInfo.pageCount !== undefined ?
                        round(book.volumeInfo.pageCount) : 1
                    )
                  )}
                  bookCover={book.volumeInfo.imageLinks !== undefined ?
                    book.volumeInfo.imageLinks.thumbnail : unknownBookCoverAddress
                  }
                />
              ))}
            </SwipeableViews>

            <div className={styles.booksGrid}>
              {CardsBooks.map((book, index) => (
                <Cards
                  key={index}
                  showCardsCircle={mainIndex === index ? true : false}
                  onClick={handleBookClick(book)}
                  style={{
                    width: "272px",
                    height: "139px",
                    padding: "17px 20px 22px 20px",
                    background: "#00173D"
                  }}
                  titleStyle={{
                    fontSize: "27px",
                    lineHeight: "35.99px",
                  }}
                  authorStyle={{
                    fontSize: "14px",
                    lineHeight: "16.41px",
                    letterSpacing: "1.29px"
                  }}
                  bookName={book.volumeInfo.title !== undefined ? book.volumeInfo.title : "Unknown title"}
                  bookAuthor={book.volumeInfo.authors !== undefined ? book.volumeInfo.authors[0] : "Unknown author"}
                  pageCount={index === 0 ? 120 : (
                    index === 1 ? 90 : (
                      book.volumeInfo.pageCount !== undefined ?
                        round(book.volumeInfo.pageCount) : 1
                    )
                  )}
                  bookCover={book.volumeInfo.imageLinks !== undefined ?
                    book.volumeInfo.imageLinks.thumbnail : unknownBookCoverAddress
                  }
                />
              ))}
            </div>
          </HeaderSection>

          <HeaderSection
            sectionLabel="Currently Reading"
            linkLabel="All"
            onClick={handleBookClick(currentlyReadingBook!)}
          >
            <img
              className={styles.currentlyReadingBookCover}
              width="88px"
              height="130px"
              src={currentlyReadingBook?.volumeInfo.imageLinks.thumbnail !== undefined ?
                currentlyReadingBook.volumeInfo.imageLinks.thumbnail : unknownBookCoverAddress}
              alt="Book cover"
            />

            <div className={styles.currentlyReading}>
              <p className={styles.title}>
                {currentlyReadingBook?.volumeInfo.title !== undefined ?
                  currentlyReadingBook.volumeInfo.title : "Unknown title"}
              </p>

              <p className={styles.author}>
                by {currentlyReadingBook?.volumeInfo.authors[0] !== undefined ?
                  currentlyReadingBook?.volumeInfo.authors[0] : "Unknown author"}
              </p>

              <div className={styles.chapterInfo}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M4.66666 8.00002C4.66666 8.51822 5.23198 8.83829 5.67633 8.57168L7 7.77748L8.32367 8.57168C8.76802 8.83829 9.33333 8.51822 9.33333 8.00002V1.33335C9.33333 0.965164 9.03485 0.666687 8.66666 0.666687H5.33333C4.96514 0.666687 4.66666 0.965164 4.66666 1.33335V8.00002ZM6.657 6.42836L6 6.82256V2.00002H8V6.82256L7.34299 6.42836C7.13187 6.30169 6.86812 6.30169 6.657 6.42836Z" fill="#E66CFF" fillOpacity="0.98" />
                  <path d="M3.33333 2.00002H10.6667C11.7712 2.00002 12.6667 2.89545 12.6667 4.00002V12C12.6667 13.1046 11.7712 14 10.6667 14H4C3.63181 14 3.33333 14.2985 3.33333 14.6667C3.33333 15.0349 3.63181 15.3334 4 15.3334H10.6667C12.5076 15.3334 14 13.841 14 12V4.00002C14 2.15907 12.5076 0.666687 10.6667 0.666687H2.66667C2.29848 0.666687 2 0.965164 2 1.33335V12C2 12.3682 2.29848 12.6667 2.66667 12.6667C3.03486 12.6667 3.33333 12.3682 3.33333 12V2.00002Z" fill="#9013FE" />
                  <circle cx="10.6667" cy="12" r="0.666667" fill="#FF9F00" />
                </svg>

                <div className={styles.chapterInfoText}>
                  Chapter <p style={{ color: "#ff6978", fontWeight: "bold" }}>&nbsp;2&nbsp;</p> From 9
                  </div>
              </div>

              <img
                className={styles.ring}
                src="ring.svg" alt=""
              />

              <svg className={styles.oval2} width="116" height="116" viewBox="0 0 116 116" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="58" cy="58" r="58" fill="#D6D1B1" fillOpacity="0.09" />
              </svg>

              <img
                className={styles.rectangle}
                src="rectangle.svg"
                alt=""
              />

              <svg className={styles.oval3} width="69" height="69" viewBox="0 0 69 69" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <circle cx="34.5" cy="34.5" r="34.5" fill="url(#pattern0)" />
                <defs>
                  <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="0.58851" height="0.103855">
                    <use xlinkHref="#image0" transform="scale(0.0173091)" />
                  </pattern>
                  <image id="image0" width="34" height="6" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAGCAYAAACmekziAAAABGdBTUEAALGOfPtRkwAAAY5JREFUKBW9Uj1IQlEUPuf6pCQofI9+CLMhaynInwyKfrYgGgxRCyEICpyaImh0aomaJKjFagjhUVRDRJNNDv61tLokgRROiZV6T/cFwitsKjpwOYfvnPN9H/deA/xjdM4stTS19W81dw+VN0OBfDwep7o81gt9DofDTByux35bK3afh4BHAPGMgKYByIKElwjswmTCmy9G2p1+G6fqOgHaEPGItbLzp7j68pMJ2+xaU7Hw6AGiVTFTIYQ7JMhKzJgtpGI5wUFml98KvBZBogGGUug5q95qfBrOeHVeaGn77k8jst03LtxuANIkAu4hwwyv8RVEmALAK4Z40ovKdTp9UNFIlBH/KK/VloFgQcxkBLSPxCqCw05IDrHjEMJmIZISvWHGcLerj23fq+q7tv89rBNBM8oOb4IIOhjAjslkiOYTark+aBnzy6VXHgDgQSAcFKJR0ZsTDysJc4dkMB4Xk7GH+rw+a+Sl0ptLkiBXSJ7m9L2GteL0ebU/0bCpA2X3Yo/s9Ia129PBf1Z+AO3ViTcdfWOLAAAAAElFTkSuQmCC" />
                </defs>
              </svg>
            </div>
          </HeaderSection>

          <HeaderSection
            sectionLabel="Reviews of The Days"
            linkLabel="All Video"
            style={{ marginTop: "45px" }}
          >
            <img
              className={styles.videoThumbnail}
              src="review-of-the-day.jpeg"
              alt="reviewOfTheDay"
            />
          </HeaderSection>
        </main>
      )}

      <footer className="footer">
        <Menu />
      </footer>
    </div>
  );
}