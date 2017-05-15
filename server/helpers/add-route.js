const addRoute = (routes, _route, handler = false, withoutAuth) => {
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

  if (withoutAuth) {
    route.config = { auth: false };
  }

  if (!route.method) {
    route.method = method;
  }
  routes.push(route);
};

module.exports = addRoute;
