export const arrayMapAsync = async <T1, T2>(
  initialArray: T1[],
  iterator: (item: T1) => Promise<T2>
): Promise<T2[]> => {
  const map: T2[] = []

  for await (const item of initialArray) {
    map.push(await iterator(item))
  }

  return map
}
