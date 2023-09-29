import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


const News = (props) => {

  const [articles, setarticles] = useState([])
  const [loading, setloading] = useState(true)
  const [page, setpage] = useState(1)
  const [totalResults, settotalResults] = useState(0)
 


  const capatilizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const updateNews = async () => {
    props.setProgress(10)
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pagesize=${props.pageSize}`;
    setloading(true)
    let data = await fetch(url);
    props.setProgress(50)
    let parsedData = await data.json()
    props.setProgress(70)
    setarticles(parsedData.articles)
    settotalResults(parsedData.totalResults)
    setloading(false)
    props.setProgress(100);
  }

  useEffect(() => {
     document.title = `${capatilizeFirstLetter(props.category)} - NewsMonkey`;
    updateNews();
  }, [])


  // async componentDidMount() {
  // let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=312d7f719b664614aec67020dcd5d891&page=1&pagesize=${props.pageSize}`;
  // this.setState({loading:true});
  // let data = await fetch(url);
  // let parsedData = await data.json()
  // this.setState({ articles: parsedData.articles,
  //   totalResults: parsedData.totalResults,
  //   loading:false
  // })
  // }

  const handlePrevClick = async () => {
    // let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&piKey=312d7f719b664614aec67020dcd5d891&page=${this.state.page - 1}&pagesize=${props.pageSize}`;
    // this.setState({loading:true});
    // let data = await fetch(url);
    // let parsedData = await data.json()
    // this.setState({
    //   page: this.state.page - 1,
    //   articles: parsedData.articles,
    //   loading:false
    // })
    setpage(page-1)
    updateNews();
  }

  const handleNextClick = async () => {
    // if (!(this.state.page + 1 > Math.ceil(this.state.totalResults /props.pageSize )) ) {
    // let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=312d7f719b664614aec67020dcd5d891&page=${this.state.page + 1}&pagesize=${props.pageSize}`;
    // this.setState({loading:true});
    // let data = await fetch(url);
    // let parsedData = await data.json()
    // this.setState({
    //   page: this.state.page + 1,
    //   articles: parsedData.articles,
    //   loading:false
    // })
    setpage(page+1)
    updateNews();
  }

  const fetchMoreData = async () => {
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=312d7f719b664614aec67020dcd5d891&page=${page+1}&pagesize=${props.pageSize}`;
    setpage(page+1)
    let data = await fetch(url);
    let parsedData = await data.json()
    setarticles(articles.concat(parsedData.articles))
    settotalResults(parsedData.totalResults)
  };

  return (
    <>
      <h1 className="text-center" style={{ margin: '35px 0px', marginTop: '90px' }} >NewsMonkey - Top {capatilizeFirstLetter(props.category)} Headlines</h1>
      {/* {this.state.loading && <Spinner />} */}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={<Spinner />}
      >
        <div className='container'>
          <div className='row'>
            {articles.map((element) => {
              return <div className='col-md-4' key={element.url}>
                <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
              </div>
            })}
          </div>
        </div>

      </InfiniteScroll>
      {/* <div className="container d-flex justify-content-between">
          <button disabled={this.state.page <= 1} type="button" className="btn btn-dark" onClick={this.handlePrevClick} >&laquo; Previous</button>
          <button disabled={this.state.page >= 5} type="button" className="btn btn-dark" onClick={this.handleNextClick} >Next &raquo; </button>
        </div> */}
    </>
  )

}

News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: "general"
}

News.propsTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string
}

export default News