import { Fragment, useState, useEffect, useCallback } from "react";

import { useSelector, useDispatch } from "react-redux";
import { getRecipes, getTypes } from "../../Redux/actions/index";

import Loader from "../../Components/Loader/Loader.jsx";
import Filters from "../../Components/Filters/Filters.jsx";
import Card from "../../Components/Card/Card.jsx";

import Paginate from "../../Components/Paginate/Paginate";

import style from "./Home.module.css";
function Home() {
  const dispatch = useDispatch();
  const [firstLoad, setFirstLoad] = useState(true);

  const totalRecipes = useSelector((state) => state.results.length);
  const created = useSelector((state) => state.created);

  const modified = useSelector((state) => state.modified);
  const [show, setShow] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const perPage = 9;
  const viewedProducts =
    currentPage * perPage + totalRecipes - (totalRecipes - show.length);

  const page = (page = 0) => {
    setCurrentPage(page);
    setShow(modified.slice(page * perPage, page * perPage + perPage));
  };

  const firstPage = useCallback(
    (page = 0) => {
      setCurrentPage(page);
      setShow(modified.slice(page * perPage, page * perPage + perPage));
    },
    [modified]
  );

  useEffect(() => {
    if (firstLoad) {
      dispatch(getRecipes());
      dispatch(getTypes());
      setFirstLoad(false);
    }

    if (!show.length && modified.length) firstPage();
  }, [firstLoad, dispatch, firstPage, show, modified, totalRecipes]);

  useEffect(() => {
    firstPage();
  }, [modified, firstPage]);

  useEffect(() => {
    if (created) {
      dispatch(getRecipes());
      dispatch({ type: "CREATED", payload: false });
    }
  }, [created]);

  return (
    <div className={style.grid}>
      <Filters />

      <div style={{ padding: "1em 2em" }}>
        {show.length ? (
          <Fragment>
            <Paginate page={page} current={currentPage} />

            <h2>Recipes</h2>
            <span className="f-small">
              {viewedProducts} / {modified.length}
            </span>
            <div className="grid">
              {show.map((recipe) => (
                <Card key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </Fragment>
        ) : totalRecipes === 0 ? (
          <Loader />
        ) : (
          <h1>Recipes not found</h1>
        )}
      </div>
    </div>
  );
}

export default Home;
