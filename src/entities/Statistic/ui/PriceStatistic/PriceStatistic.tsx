import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { getAssetsData } from 'entities/Assets';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAppSelector } from 'shared/hooks/redux';

interface StatData {
  date: string;
  price: number;
}

export const PriceStatistic: React.FC = React.memo(() => {
  const assets = useAppSelector(getAssetsData);
  const [statData, setStatData] = useState<StatData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getHistory = useCallback(async () => {
    const promises = assets.map((item) =>
      fetch(
        `${process.env.REACT_APP_API_URL}/assets/history/${item.ticker}`,
      )
        .then((resp) => {
          if (!resp.ok) throw new Error('API rate limit. Please wait 1-2 min.');
          return resp.json();
        })
        .then((data) =>
          data.prices.map((historyPrices: number[]) => ({
            date: historyPrices[0],
            price: historyPrices[1] * item.count,
          })),
        ),
    );
    return Promise.all(promises);
  }, [assets]);

  useEffect(() => {
    if (assets.length === 0) return;
    setIsLoading(true);
    setError(null);
    getHistory()
      .then((data) => {
        const allPrices: StatData[] = ([] as StatData[]).concat(...data);
        const shortPrices = allPrices.slice(0, 7);
        if (allPrices.length > 0) {
          const resultStat: StatData[] = shortPrices.map((shortItem) => {
            const sum: StatData = { date: shortItem.date, price: 0 };
            allPrices.forEach((allItem) => {
              if (allItem.date === shortItem.date) {
                const dates = new Date(allItem.date);
                sum.date = `${dates.getDate()}/${dates.getMonth() + 1}/${dates.getFullYear()}`;
                sum.price += allItem.price;
              }
            });
            return sum;
          });
          setStatData(resultStat);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [assets, getHistory]);

  const getMaxRange = () => {
    if (!statData || statData.length === 0) return 0;
    const max = Math.max(...statData.map((i) => i.price));
    return +(max + (max / 100) * 5).toFixed();
  };

  const getMinRange = () => {
    if (!statData || statData.length === 0) return 0;
    const min = Math.min(...statData.map((i) => i.price));
    return +(min - (min / 100) * 5).toFixed();
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        backgroundColor: '#fff',
        borderRadius: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '322px',
      }}
    >
      {isLoading && (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <CircularProgress size={40} sx={{ color: '#8884d8' }} />
          <Typography variant="body2" color="text.secondary">
            Loading chart data...
          </Typography>
        </Box>
      )}

      {error && !isLoading && (
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <Typography variant="body1" color="error">⚠️ {error}</Typography>
          <Typography variant="body2" color="text.secondary">
            CoinGecko free API has rate limits. Wait 1-2 min and refresh.
          </Typography>
        </Box>
      )}

      {!isLoading && !error && !statData && (
        <Typography variant="body2" color="text.secondary">
          No chart data. Add coins to your portfolio first.
        </Typography>
      )}

      {!isLoading && !error && statData && (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={statData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" dy={10} fontSize={14} />
            <YAxis domain={[getMinRange(), getMaxRange()]} dx={-5} fontSize={14} />
            <Tooltip />
            <Area type="monotone" dataKey="price" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
});