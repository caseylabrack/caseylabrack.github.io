library(tidyverse)
library(readxl)

data = read_excel("51138-2025-01-Revenue-Projections.xlsx", range = "7b. Legislation (Pct of GDP)!A8:BD49") %>% 
  gather(key = year, value = value, 3:ncol(.)) %>% 
  drop_na() %>% 
  mutate(value = as.numeric(value), 
         value = if_else(is.na(value), 0, value),
         value = round(value, digits = 1)
         ) %>% 
  rename(`pl` = 1, `title` = 2) %>% 
  mutate(title = case_match(title,
                            "An Act to provide for reconciliation pursuant to title II of S. Con. Res. 14. (Originally titled the Inflation Reduction Act, 2022)" ~ "Inflation Reduction Act, 2022",
                            "An Act to provide for reconciliation pursuant to titles II and V of the concurrent resolution on the budget for fiscal year 2018. (Originally titled the Tax Cuts and Jobs Act, 2017)" ~ "Tax Cuts and Jobs Act, 2017",
                            "Patient Protection and Affordable Health Care Act; Health Care and Education Reconciliation Act of 2010" ~ "Patient Protection and Affordable Health Care Act",
                            .default = title
                            ))

past25years = data %>% 
  group_by(title) %>% 
  summarize(start = min(year), end = max(year)) %>% 
  filter(start > 2000) %>% 
  arrange(start)

export = data %>% 
  filter(title %in% c(past25years$title))

write_csv(export, "data.csv")