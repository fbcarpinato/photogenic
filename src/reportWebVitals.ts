const reportWebVitals = async (onPerfEntry?: () => void): Promise<void> => {
  if (onPerfEntry != null && onPerfEntry instanceof Function) {
    const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import(
      'web-vitals'
    )

    getCLS(onPerfEntry)
    getFID(onPerfEntry)
    getFCP(onPerfEntry)
    getLCP(onPerfEntry)
    getTTFB(onPerfEntry)
  }
}

export default reportWebVitals
