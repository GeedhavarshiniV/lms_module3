import Organization from "../models/Organization.js";

export const createOrganization = async (req, res) => {
  const org = await Organization.create(req.body);
  res.status(201).json(org);
};

export const getOrganization = async (req, res) => {
  const org = await Organization.findById(req.params.id);
  res.json(org);
};

export const updateOrganization = async (req, res) => {
  const org = await Organization.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(org);
};
