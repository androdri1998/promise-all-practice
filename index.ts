import api from "./api";
import { IUfSearch, IUf } from "./types";

const awaitPromise = async () => {
  const searchesUfs: IUfSearch[] = [{ uf: "CE" }];

  const promisesFun = async (searches: IUfSearch[]) => {
    const promises = await Promise.all(
      searches.map(async (search) => {
        const response = await api.get("/localidades/estados");

        const ufFound: IUf = response.data.find(
          (uf: IUf) => uf.sigla === search.uf
        );

        const responseCities = await api.get(
          `/localidades/estados/${ufFound.id}/municipios`
        );

        return responseCities.data;
      })
    );

    return searches.map((search, index) => ({
      uf: search.uf,
      cities: promises[index],
    }));
  };

  const promises = await promisesFun(searchesUfs);
  console.log(promises);
};

awaitPromise();
