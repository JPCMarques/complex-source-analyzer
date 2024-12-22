
/**
 * Provided a path, find all exports of it.
 * @param {string} path - the path to the file.
 * @returns {[string, any][]} array of exports in the format [key, value]
 */
export async function getExports(path) {
  const fileExports = await import(path);

  return Object.entries(fileExports);
}

/**
 * Stringifies export data for human readibility.
 *
 * @param {[string, any][]} data - export data from {@link getExports} 
 */
export function stringifyExports(data) {
  const sortedData = data.sort((a, b) => `${typeof a[1]}${a[0]}` < `${typeof b[1]}${b[0]}` ? -1 : 1);

  const prettyData = sortedData.map(([k, v]) => `${typeof v}\t ${k}`).join('\n');

  return prettyData;
}
