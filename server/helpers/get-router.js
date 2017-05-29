const getRouter = (routes) => {
  function router(_route, handler = false, config = {}) {
    let method = 'GET';
    let route = _route;

    if (typeof route === 'string') {
      const terms = route.split(' ');

      if (terms.length === 2) {
        route = terms[1];
        method = terms[0];
      }

      route = {
        path: route,
        handler
      };
    }

    route.config = config;

    if (!route.method) {
      route.method = method;
    }
    routes.push(route);
  }

  router.post = (_route, ...args) => router(`POST ${_route}`, ...args);
  router.put = (_route, ...args) => router(`PUT ${_route}`, ...args);
  router.delete = (_route, ...args) => router(`DELETE ${_route}`, ...args);

  return router;
};

module.exports = getRouter;
